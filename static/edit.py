from PIL import Image

# 이미지 파일 열기
image_path = "static/logo128.png"  # 여기에 PNG 파일 경로를 넣으세요
img = Image.open(image_path)

# 이미지 크기 조정 (128x128)
size = 32

img_resized = img.resize((size, size))

# 크기 조정된 이미지 저장
output_path = f"static/logo{size}.png"  # 저장할 경로와 파일명
img_resized.save(output_path)

# 만약 Jupyter Notebook에서 이미지를 바로 보고 싶다면, 다음을 사용할 수 있습니다.
img_resized.show()
