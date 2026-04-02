import { Orientation } from "src/common/enums"

export const getSliceOrientation = (orientation: number[]) => {
    const rounded = orientation.map(val => Math.round(val));

    if(JSON.stringify(rounded) === JSON.stringify([1, 0, 0, 0, 1, 0]))
        return Orientation.Axial
    else if(JSON.stringify(rounded) === JSON.stringify([0, 1, 0, 0, 0, -1]))
        return Orientation.Sagittal
    else if(JSON.stringify(rounded) === JSON.stringify([1, 0, 0, 0, 0, -1]))
        return Orientation.Coronal
    else
        return Orientation.ObliqueCut
}

export const getSliceOrientationFromSeriesDescription = (seriesDescription: string) => {
    if(seriesDescription.includes('tra'))
        return Orientation.Axial
    else if(seriesDescription.includes('cor'))
        return Orientation.Coronal
    else if(seriesDescription.includes('sag'))
        return Orientation.Sagittal
    else
        return null;
}