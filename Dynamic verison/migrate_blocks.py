import os
import json
import re

blocks_dir = 'blocks'
ui_dir = 'block_UI'

if not os.path.exists(ui_dir):
    os.makedirs(ui_dir)

with open('blocks.json', 'r') as f:
    block_names = json.load(f)

for name in block_names:
    file_path = os.path.join(blocks_dir, f"{name}.js")
    if not os.path.exists(file_path):
        print(f"Skipping {name}, file not found.")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to find the inspector function
    # Matches "inspector: (args) => { ... }" or "inspector: function(args) { ... }"
    # Handles nested braces by doing a simple count or regex if possible
    # Given the consistent style, regex works for most but let's be careful
    
    match = re.search(r'inspector:\s*(\([^)]*\)\s*=>\s*\{|function\s*\([^)]*\)\s*\{)', content)
    if match:
        start_idx = match.start()
        # Find the matching closing brace for the inspector function
        brace_count = 0
        end_idx = -1
        for i in range(match.start(1), len(content)):
            if content[i] == '{':
                brace_count += 1
            elif content[i] == '}':
                brace_count -= 1
                if brace_count == 0:
                    end_idx = i + 1
                    break
        
        if end_idx != -1:
            inspector_code = content[start_idx:end_idx]
            # Extract just the function part
            func_part = re.sub(r'^inspector:\s*', '', inspector_code)
            
            # Create UI file
            ui_file_path = os.path.join(ui_dir, f"{name}_UI.js")
            with open(ui_file_path, 'w', encoding='utf-8') as f_ui:
                f_ui.write(f"export default {func_part};\n")
            
            # Remove inspector from original file
            # Also handle potential trailing/leading commas
            new_content = content[:start_idx] + content[end_idx:]
            # Clean up commas: ", ," or ", }" or "{ ,"
            new_content = re.sub(r',\s*,', ',', new_content)
            new_content = re.sub(r',\s*\}', '\n}', new_content)
            new_content = re.sub(r'\{\s*,', '{', new_content)
            
            with open(file_path, 'w', encoding='utf-8') as f_orig:
                f_orig.write(new_content)
            
            print(f"Migrated {name}")
        else:
            print(f"Could not find end of inspector for {name}")
    else:
        print(f"No inspector found in {name}")
