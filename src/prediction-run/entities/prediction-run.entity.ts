import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, Column, DataType, DeletedAt, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Status } from "src/common/enums";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Prediction } from "src/prediction/entities/prediction.entity";
import { Series } from "src/series/entities/series.entity";
import { User } from "src/users/entities/user.entity";

interface TableCreationAttrs {
    readonly seriesId: number;
    readonly createdById: number;
    readonly model: string;
    readonly version: string;
}
@Table({ tableName: 'prediction_run', paranoid: true })
export class PredictionRun extends Model<PredictionRun, TableCreationAttrs> {
    @ApiProperty({ example: 1, description: 'Уникальный ID запуска предсказания' })
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
    id: number;

    // Внешний ключ укзаывающий на серию
    @ApiProperty({ example: 1, description: 'Уникальный ID серии' })
    @ForeignKey(() => Series)
    @Column({ type: DataType.INTEGER, })
    seriesId: number;

    // alias для серии
    @BelongsTo(() => Series)
    series: Series;

    // Внешний ключ укзаывающий на создателя
    @ApiProperty({ example: 1, description: 'Уникальный ID того кто запустил предсказание' })
    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, })
    createdById: number;

    // alias для создателя
    @BelongsTo(() => User)
    createdBy: User;

    @ApiProperty({ example: 'YOLO', description: 'Модель' })
    @Column({ type: DataType.STRING, })
    model: string;

    @ApiProperty({ example: '8l', description: 'Версия' })
    @Column({ type: DataType.STRING, })
    version: string;

    @ApiProperty({ example: Status.Pending, description: 'Статус обработки', enum: Object.values(Status), })
    @Column({ type: DataType.ENUM(...Object.values(Status)), defaultValue: Status.Pending })
    status: Status;

    @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false })
    @DeletedAt
    @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
    declare deletedAt?: Date | null;

    @HasMany(() => Prediction)
    predictions: Prediction[];
}
