import tensorflow as tf
from object_detection.utils import config_util
from object_detection.builders import model_builder
from object_detection.utils import visualization_utils as viz_utils
from object_detection.utils import label_map_util
import numpy as np

class TFObjectDetector:

    def __init__(self, config_path, model_dir, label_path):
        # Load saved model and build the detection function
        self.detection_model = self.load_model(config_path, model_dir)

        # Load the label map
        self.category_index = label_map_util.create_category_index_from_labelmap(label_path, use_display_name=True)

    def load_model(self, config_path, model_dir):
        # Load pipeline config and build the detection model
        configs = config_util.get_configs_from_pipeline_file(config_path)
        model_config = configs['model']
        detection_model = model_builder.build(model_config=model_config, is_training=False)

        # Restore checkpoint
        ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
        ckpt.restore(tf.train.latest_checkpoint(model_dir)).expect_partial()

        return detection_model

    def detect(self, image_np):
    # Convert the image to a tensor.
        input_tensor = tf.convert_to_tensor([image_np], dtype=tf.float32)

        # Detection
        detections = self.detection_model(input_tensor)
        
        # Convert detections to a dictionary and then a list for easier processing
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy() for key, value in detections.items()}
        detections['num_detections'] = num_detections
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)
        
        print("Detection Classes:", detections['detection_classes'])
        print("Detection Scores:", detections['detection_scores'])
        print("Detection Boxes:", detections['detection_boxes'])

        return detections


    def visualize(self, image_np, detections):
        viz_utils.visualize_boxes_and_labels_on_image_array(
            image_np,
            detections['detection_boxes'],
            detections['detection_classes'],
            detections['detection_scores'],
            self.category_index,
            use_normalized_coordinates=True,
            max_boxes_to_draw=200,
            min_score_thresh=.30,
            agnostic_mode=False)
        return image_np
