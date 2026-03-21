import os, re

old_light_color = "rgb(89,90,92)"
old_dark_color = "'rgb(54,47,36)'"
def recolor_svg_cat(file_path: str, path_to_new: str, color_name: str, lightColor: str, darkColor: str):
    with open(file_path) as svg:
        lines = svg.readlines()
        new_lines = []
        for line in lines:
            new_line = line.replace(old_light_color, lightColor).replace(old_dark_color, darkColor)
            new_lines.append(new_line)
    
    if color_name not in os.listdir(path_to_new):
        os.mkdir(os.path.join(path_to_new, color_name))
    with open(os.path.join(path_to_new, color_name, file_path), "w+") as new_svg:
        new_svg.writelines(new_lines)

def recolor_all(path_to_new: str, color_name: str, light_color: str, dark_color: str):
    recolor_svg_cat("cat_walk.svg", path_to_new, color_name, light_color, dark_color)
    recolor_svg_cat("cat_walk2.svg", path_to_new, color_name, light_color, dark_color)
    recolor_svg_cat("cat_sleep.svg", path_to_new, color_name, light_color, dark_color)
    recolor_svg_cat("cat_sit.svg", path_to_new, color_name, light_color, dark_color)

path_to_assets = "../../raw-assets/preload{m}/cat"
recolor_all(path_to_assets, "white","#EBDBC4", "#FFFFFF")
recolor_all(path_to_assets, "grey", "#FFF1D7", "#9E8A80")
