import cv2
import numpy as np
import pydicom
import os

def abstract_image(image_path):
    # Read the DICOM file
    ds = pydicom.dcmread(image_path)
    image = ds.pixel_array
    # Convert the pixel array to 8-bit unsigned integer if necessary
    if image.dtype != np.uint8:
        image = cv2.normalize(image, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image

    # Generate a binary image using threshold operation
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

    # Detect contours using cv2.findContours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    return image, contours

def compare_images_similarity(image_path_1, image_path_2):
    _, contours_1 = abstract_image(image_path_1)
    _, contours_2 = abstract_image(image_path_2)
    # Assume we take the largest contour from each image for comparison
    if contours_1 and contours_2:
        largest_contour_1 = max(contours_1, key=cv2.contourArea)
        largest_contour_2 = max(contours_2, key=cv2.contourArea)
        similarity = cv2.matchShapes(largest_contour_1, largest_contour_2, cv2.CONTOURS_MATCH_I1, 0)
        return similarity
    return None

def find_best_similar_file(mri_image_path, ct_folder_path):
    # Get all DICOM files in the CT folder
    ct_files = [os.path.join(ct_folder_path, f) for f in os.listdir(ct_folder_path) if f.endswith('.dcm')]
    best_similarity = float('inf')
    best_file = None
    for ct_file in ct_files:
        similarity = compare_images_similarity(mri_image_path, ct_file)
        if similarity is not None:
            #print(f"Similarity between {mri_image_path} and {ct_file}: {similarity}")
            if similarity < best_similarity:
                best_similarity = similarity
                best_file = ct_file
    if best_file:
        print(f"The best similar file for {mri_image_path} in {ct_folder_path} is {best_file} with similarity: {best_similarity}")
    else:
        print("No similar file found.")
    return best_file, best_similarity

def main():
    mri_base_folder = '..\\MRI'
    ct_base_folder = '..\\CT'

    # Iterate over all subdirectories in the MRI base folder
    for patient_folder in os.listdir(mri_base_folder):
        mri_folder_path = os.path.join(mri_base_folder, patient_folder)
        ct_folder_path = os.path.join(ct_base_folder, patient_folder)

        # Check if both MRI and CT folders exist for the patient
        if os.path.isdir(mri_folder_path) and os.path.isdir(ct_folder_path):
            mri_files = [os.path.join(mri_folder_path, f) for f in os.listdir(mri_folder_path) if f.endswith('.dcm')]
            for mri_file in mri_files:
                best_file, best_similarity = find_best_similar_file(mri_file, ct_folder_path)
                if best_file and best_similarity < 0.2:
                    print(f"For {mri_file}, the best similar file in {ct_folder_path} is {best_file} with similarity: {best_similarity}")
                elif best_file is None:
                    print(f"No similar file found for {mri_file} in {ct_folder_path}.")
                # Don't print if similarity >= 0.2

    """
    image_path_1 = '..\\CT\\CHENG ZHEN_A0045638\\0.dcm'
    image_path_2 = '..\\MRI\\CHENG ZHEN_A0045638\\0.dcm'  # Replace with another actual image path

    similarity = compare_images_similarity(image_path_1, image_path_2)
    if similarity is not None:
        print(f"The similarity between the two images is: {similarity}")
    else:
        print("Could not calculate similarity, one or both images have no detected contours.")

    image, contours = abstract_image(image_path_2)
    # Draw contours
    cv2.drawContours(image, contours, -1, (0, 255, 0), 2)
    # Display the result
    cv2.imshow('Contours', image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    """

if __name__ == "__main__":
    main()