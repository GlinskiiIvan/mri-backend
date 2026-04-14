import sys
import json
import os
import pydicom
from PIL import Image
import numpy as np
import cv2
from collections import defaultdict

from collections import defaultdict
from pydicom.multival import MultiValue
from pydicom.valuerep import PersonName
from pydicom.errors import InvalidDicomError

import warnings
warnings.filterwarnings("ignore", message="Invalid value for VR UI")

from pydicom import config
# Разрешить некорректные значения
config.allow_invalid_values = True

def to_serializable(value):
    """Преобразуем pydicom значения в обычные JSON-сериализуемые типы"""
    if isinstance(value, MultiValue):
        return [to_serializable(v) for v in value]
    if isinstance(value, PersonName):
        return str(value)
    if isinstance(value, (int, float, str)):
        return value
    if isinstance(value, (list, tuple)):
        return [to_serializable(v) for v in value]
    return str(value)  # всё остальное превращаем в строку

def get_attrs(file):
    image_data = {}
    ds = pydicom.dcmread(file)
    for element in ds:
        value = element.value
        if isinstance(value, bytes):
            continue
        value = to_serializable(value)
        
        # Если это список с одним элементом, превращаем в сам элемент
        if isinstance(value, list) and len(value) == 1:
            value = value[0]
        
        image_data[element.name] = value
    return image_data

# Функция для конвертации DICOM в PNG с нормализацией яркости
def convert_dicom_to_png(dicom_path, output_dir, apply_clahe=True, apply_laplacian=True):
    try:
        if not os.path.exists(dicom_path):
            raise FileNotFoundError(f"File not found: {dicom_path}")

        try:
            ds = pydicom.dcmread(dicom_path)
        except Exception as e:
            raise Exception(f"Invalid DICOM file: {dicom_path}. {str(e)}")

        if not hasattr(ds, 'pixel_array'):
            raise Exception(f"No pixel data in DICOM: {dicom_path}")

        # Чтение DICOM файла
        ds = pydicom.dcmread(dicom_path)
        image_data = ds.pixel_array

        series_number = str(getattr(ds, 'SeriesNumber', 'N/A'))

        # Нормализация яркости для корректного отображения
        image_data = (image_data - np.min(image_data)) / (np.max(image_data) - np.min(image_data)) * 255
        image_data = image_data.astype(np.uint8)  # Конвертируем в 8-битный формат
        
        # Применение CLAHE (по желанию)
        if apply_clahe:
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            image_data = clahe.apply(image_data)

        # Применение фильтра Лапласа для усиления краев (по желанию)
        if apply_laplacian:
            laplacian = cv2.Laplacian(image_data, cv2.CV_64F)
            laplacian_abs = cv2.convertScaleAbs(laplacian)
            image_data = cv2.addWeighted(image_data, 1.0, laplacian_abs, 0.5, 0)

        # Создание изображения и сохранение в формате PNG
        img = Image.fromarray(image_data)

        # Создание конечного пути для сохранения изображения
        os.makedirs(output_dir, exist_ok=True)
        
        # Генерация имени файла без расширения .dcm
        filename = f"{os.path.splitext(os.path.basename(dicom_path))[0]}.png"
        output_path = os.path.join(output_dir, filename)
        
        img.save(output_path)
        # print(f"Сохранено: {output_path}")

        return {
            "imageName": filename,
            "rawMetadata": get_attrs(dicom_path)
        }
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if len(sys.argv) > 2 and sys.argv[1] == 'convert_dicom_to_png':
    result = convert_dicom_to_png(sys.argv[2], sys.argv[3])
    print(json.dumps(result), flush=True)

sys.stdout.flush()