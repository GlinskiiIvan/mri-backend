import sys
import time
import os
import json
import contextlib
import io
from ultralytics import YOLO

def YOLO_bbox(version: str, source: str):
    start_time = time.time()

    try:
        if not os.path.exists(source):
            raise Exception(f"File not found: {source}")

        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        modelPath = os.path.join(BASE_DIR, 'models', 'yolo', 'bbox', f'{version}.pt')
        
        model = YOLO(modelPath)
        results = model(source, verbose=False)

        result = results[0]

        boxes = result.boxes

        output = []

        if len(boxes) > 0:
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                class_name = model.names[cls_id]
                confidence = float(boxes.conf[i])
                bbox = boxes.xyxy[i].tolist()

                output.append({
                    "class": class_name,
                    "confidence": round(confidence, 4),
                    "bbox": bbox
                })

        execution_time = int((time.time() - start_time) * 1000)
        
        return {
            "predictions": output,
            "executionTime": execution_time
        }
    except Exception as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if len(sys.argv) > 2 and sys.argv[1] == 'YOLO-bbox':
    result = YOLO_bbox(sys.argv[2], sys.argv[3])
    print(json.dumps(result), flush=True)

sys.stdout.flush()