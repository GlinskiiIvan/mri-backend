import sys
import os
import json
import re
import pydicom
from typing import List
from collections import defaultdict


def is_knee(body_part, study_description):
    return ('knee' in body_part) or ('ankle' in body_part) or ('knee' in study_description) or ('ks' in study_description) or ('kolen' in study_description) or ('kalen' in study_description) or ('kolan' in study_description) or ('kalan' in study_description)

def extract_methods_from_name(image_name: str) -> List[str]:
    # Словарь методов визуализации с уточнением шаблонов
    methods = {
        "FSE": r"(?:_|^| )fse(?:_| |$)", 
        # "FFE": r"(?:_|^| )ffe(?:_| |$)", 
        # "IRFFE": r"(?:_|^| )irffe(?:_| |$)", 
        "TSE": r"(?:_|^| )tse(?:_| |$)",  
        # "IR-TSE": r"(?:_|^| )ir-tse(?:_| |$)",  
        # "ATSE": r"(?:_|^| )atse(?:_| |$)",  
        # "STIR": r"(?:_|^| )stir(?:_| |$)",  
        # "SPIR": r"(?:_|^| )spir(?:_| |$)",  
        # "SPAIR": r"(?:_|^| )spair(?:_| |$)",  
        "FS": r"(?:_|^| )fs(?:_| |$)",  
        "FSAT": r"(?:_|^| )fsat(?:_| |$)",  
        # "FSIR": r"(?:_|^| )fsir(?:_| |$)",  
        "FATSAT": r"(?:_|^| )fatsat(?:_| |$)",  
        "FATSAT": r"(?:_|^| )fat sat(?:_| |$)",  
        # "FAT": r"(?:_|^| )fat(?:_| |$)",  
        # "FGRE": r"(?:_|^| )fgre(?:_| |$)",  
        # "GRE": r"(?:_|^| )gre(?:_| |$)",  
        # "GRE2D": r"(?:_|^| )gre2d(?:_| |$)",  
        # "IR": r"(?:_|^| )ir(?:_| |$)",  
        # "FRFSE": r"(?:_|^| )frfse(?:_| |$)",  
        # "PROP": r"(?:_|^| )prop(?:_| |$)",  
        # "TIRM": r"(?:_|^| )tirm(?:_| |$)",  
        # "DIXON": r"(?:_|^| )dixon(?:_| |$)",  
        # "TRUFI": r"(?:_|^| )trufi(?:_| |$)",  
        "SE": r"(?:_|^| )se(?:_| |$)"  
    }

    # Приведение строки к нижнему регистру
    image_name = image_name.lower()

    # Поиск совпадений
    detected_methods = [method for method, pattern in methods.items() if re.search(pattern, image_name)]
    
    return detected_methods

def is_t1_allowed(series_description: str, methods: List[str]):
    return ('t1' in series_description) and (('FSE' in methods) or ('TSE' in methods) or ('SE' in methods))

def is_t2_allowed(series_description: str, methods: List[str]):
    return ('t2' in series_description) and (('FSE' in methods) or ('TSE' in methods) or ('SE' in methods))

def is_pd_allowed(series_description: str, methods: List[str]):
    return ('pd' in series_description) and (('FS' in methods) or ('FSAT' in methods) or ('FATSAT' in methods))

def is_protocol_allowed(series_description: str, methods: List[str]):
    return is_t1_allowed(series_description, methods) or is_t2_allowed(series_description, methods) or is_pd_allowed(series_description, methods)

def parse_series(main_directory):
    series_data = defaultdict(list)
    for root, _, files in os.walk(main_directory):
        for file in files:
            dicom_path = os.path.join(root, file)
            
            # Проверяем, если файл является DICOM, пытаясь его прочитать
            try:
                ds = pydicom.dcmread(dicom_path)
                series_uid = getattr(ds, 'SeriesInstanceUID', None)
                body_part = getattr(ds, 'BodyPartExamined', '').lower()
                study_description = getattr(ds, 'StudyDescription', '').lower()
                series_description = getattr(ds, 'SeriesDescription', 'N/A').lower()
                methods = extract_methods_from_name(series_description)
                if series_uid:
                    if is_knee(body_part, study_description) and is_protocol_allowed(series_description, methods):
                        # Добавляем файл к соответствующей серии
                        series_data[series_uid].append(dicom_path)
            except pydicom.errors.InvalidDicomError:
                # Пропускаем, если файл не является DICOM
                continue
            except Exception as e:
                print(f"Ошибка при обработке {dicom_path}: {e}")
    return series_data

if len(sys.argv) > 2 and sys.argv[1] == 'parse_series':
    result = parse_series(sys.argv[2])
    print(json.dumps(result), flush=True)

sys.stdout.flush()