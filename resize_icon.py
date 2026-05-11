from PIL import Image

# Open the original weather icon
img = Image.open("ChatGPT Image 11. Mai 2026, 16_16_04.png")

# Android icon sizes
sizes = {
    'mdpi': (48, 48),
    'hdpi': (72, 72), 
    'xhdpi': (96, 96),
    'xxhdpi': (144, 144),
    'xxxhdpi': (192, 192)
}

# Create icons for all sizes
for size_name, (width, height) in sizes.items():
    resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
    resized_img.save(f"android/app/src/main/res/mipmap-{size_name}/ic_launcher.png")
    resized_img.save(f"android/app/src/main/res/mipmap-{size_name}/ic_launcher_round.png")

print("Icons resized successfully!")
