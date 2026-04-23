import os
import re
import json
from pathlib import Path

def is_chapter_folder(folder_name):
    """判断文件夹名是否符合“第X章”模式（X为数字）"""
    pattern = r'^第[0-9]+章'
    return bool(re.match(pattern, folder_name))

def collect_html_files(root_dir, chapter_folder):
    """
    递归遍历章节文件夹，收集所有 .html 文件
    返回列表，每个元素为 {'name': 显示名, 'relative_path': 相对于根目录的路径}
    """
    html_files = []
    chapter_path = os.path.join(root_dir, chapter_folder)
    for dirpath, _, filenames in os.walk(chapter_path):
        for filename in filenames:
            if filename.lower().endswith('.html'):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                rel_path = rel_path.replace('\\', '/')
                display_name = os.path.splitext(filename)[0]
                html_files.append({
                    'name': display_name,
                    'file': rel_path
                })
    html_files.sort(key=lambda x: x['name'])
    return html_files

def generate_index(root_dir):
    """扫描根目录，生成 index.html（居中标题，页脚含版权信息）"""
    # 筛选章节文件夹
    chapters = []
    for item in os.listdir(root_dir):
        item_path = os.path.join(root_dir, item)
        if os.path.isdir(item_path) and not item.startswith('.') and is_chapter_folder(item):
            chapters.append(item)
    chapters.sort()

    # 收集课件数据
    chapter_data = []
    for chapter in chapters:
        html_files = collect_html_files(root_dir, chapter)
        chapter_data.append({
            'name': chapter,
            'files': html_files
        })

    # 生成 HTML 内容（页脚已重新设计）
    html_content = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>华师版初中数学电子课本目录</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: 'Segoe UI', 'Roboto', 'Noto Sans', system-ui, -apple-system, 'Helvetica Neue', sans-serif;
            background: #f5f9f0;
            padding: 2rem 1.5rem;
            color: #1e2a3e;
        }}
        .container {{
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            border-radius: 40px;
            box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.12);
            overflow: hidden;
            transition: all 0.2s;
        }}
        /* ========= 标题区域（居中简约风格） ========= */
        .header {{
            background: linear-gradient(135deg, #0f3b2c 0%, #1e6f3f 100%);
            padding: 2.8rem 2rem;
            color: white;
            position: relative;
            overflow: hidden;
            text-align: center;
        }}
        .header::before {{
            content: "📐";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 120px;
            opacity: 0.06;
            pointer-events: none;
            font-weight: normal;
            white-space: nowrap;
        }}
        .header h1 {{
            font-size: 2.6rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            line-height: 1.2;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            position: relative;
            z-index: 1;
        }}
        .header .sub {{
            font-size: 1rem;
            opacity: 0.85;
            position: relative;
            z-index: 1;
            letter-spacing: 1px;
        }}
        /* ========= 内容区域 ========= */
        .content {{
            padding: 1.8rem 2rem 2.5rem;
        }}
        .chapter-list {{
            display: flex;
            flex-direction: column;
            gap: 12px;
        }}
        .chapter-item {{
            background: #fbfef9;
            border-radius: 28px;
            border: 1px solid #e2edda;
            overflow: hidden;
            transition: all 0.2s;
        }}
        .chapter-item:hover {{
            border-color: #bdd4aa;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }}
        .chapter-header {{
            background: #f8fff4;
            padding: 1rem 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 600;
            font-size: 1.2rem;
            color: #1e4620;
            transition: background 0.2s;
            user-select: none;
        }}
        .chapter-header:hover {{
            background: #efffdf;
        }}
        .chapter-name {{
            display: flex;
            align-items: center;
            gap: 12px;
        }}
        .folder-icon {{
            font-size: 1.4rem;
        }}
        .toggle-icon {{
            font-size: 1.3rem;
            transition: transform 0.2s;
            color: #6b8c5c;
        }}
        .file-list {{
            padding: 0.5rem 1rem 1rem 3rem;
            border-top: 1px solid #e5f0dc;
            background: #ffffff;
            display: none;
        }}
        .file-list.open {{
            display: block;
        }}
        .file-grid {{
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
        }}
        .file-link {{
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 0.7rem 1rem;
            background: #fafef7;
            border-radius: 20px;
            text-decoration: none;
            color: #2c5e2a;
            font-weight: 500;
            transition: all 0.2s;
            border: 1px solid #e2f0da;
        }}
        .file-link:hover {{
            background: #ecfae3;
            border-color: #a8cf8a;
            transform: translateX(5px);
            color: #1b4c1a;
        }}
        .file-icon {{
            font-size: 1.25rem;
        }}
        .file-name {{
            font-size: 0.98rem;
            word-break: break-word;
        }}
        .empty-tip {{
            padding: 1rem 0;
            color: #8ba07a;
            font-style: italic;
            font-size: 0.9rem;
        }}
        /* ========= 页脚区域（重新设计） ========= */
        .footer {{
            background: #f3f9ef;
            padding: 1rem 2rem;
            text-align: center;
            border-top: 1px solid #e0edcf;
            font-size: 0.75rem;
            color: #6f8664;
            line-height: 1.5;
        }}
        .footer .footer-main {{
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
        }}
        .footer .footer-main span {{
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }}
        .footer .copyright {{
            font-size: 0.7rem;
            opacity: 0.8;
            border-top: 1px dashed #d0e2c0;
            padding-top: 8px;
            margin-top: 6px;
        }}
        @media (max-width: 640px) {{
            body {{
                padding: 1rem;
            }}
            .header {{
                padding: 2rem 1rem;
            }}
            .header h1 {{
                font-size: 1.8rem;
            }}
            .header .sub {{
                font-size: 0.85rem;
            }}
            .content {{
                padding: 1.2rem;
            }}
            .chapter-header {{
                padding: 0.8rem 1rem;
                font-size: 1rem;
            }}
            .file-list {{
                padding-left: 1.5rem;
            }}
            .footer {{
                padding: 0.8rem 1rem;
            }}
        }}
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>华师版初中数学</h1>
        <div class="sub">新版教材 · HTML互动课件</div>
    </div>
    <div class="content">
        <div class="chapter-list" id="chapterList"></div>
    </div>
    <div class="footer">
        <div class="footer-main">
            <span>📖 本目录已静态生成</span>
            <span>🔍 点击章节展开课件列表</span>
            <span>📁 支持子文件夹中的课件</span>
        </div>
        <div class="copyright">
            © 2025 华师版初中数学电子课件 · 整理制作：孙起孟老师
        </div>
    </div>
</div>

<script>
    const chapterData = {json.dumps(chapter_data, ensure_ascii=False)};

    function buildCatalog() {{
        const container = document.getElementById('chapterList');
        if (!chapterData.length) {{
            container.innerHTML = '<div class="empty-tip">未找到任何符合“第X章”格式的文件夹。</div>';
            return;
        }}

        for (const chapter of chapterData) {{
            const chapterDiv = document.createElement('div');
            chapterDiv.className = 'chapter-item';

            const header = document.createElement('div');
            header.className = 'chapter-header';
            const nameSpan = document.createElement('div');
            nameSpan.className = 'chapter-name';
            nameSpan.innerHTML = `<span class="folder-icon">📁</span> <span>${{escapeHtml(chapter.name)}}</span>`;
            const toggleSpan = document.createElement('span');
            toggleSpan.className = 'toggle-icon';
            toggleSpan.innerHTML = '▶';
            header.appendChild(nameSpan);
            header.appendChild(toggleSpan);

            const fileListDiv = document.createElement('div');
            fileListDiv.className = 'file-list';

            if (chapter.files.length === 0) {{
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'empty-tip';
                emptyMsg.innerHTML = '📭 该章节暂无 .html 课件文件';
                fileListDiv.appendChild(emptyMsg);
            }} else {{
                const grid = document.createElement('div');
                grid.className = 'file-grid';
                for (const file of chapter.files) {{
                    const link = document.createElement('a');
                    link.className = 'file-link';
                    link.href = `./${{file.file}}`;
                    link.target = '_blank';
                    link.title = `点击打开课件：${{file.name}}`;
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'file-icon';
                    iconSpan.textContent = '📄';
                    const nameSpanFile = document.createElement('span');
                    nameSpanFile.className = 'file-name';
                    nameSpanFile.textContent = file.name;
                    link.appendChild(iconSpan);
                    link.appendChild(nameSpanFile);
                    grid.appendChild(link);
                }}
                fileListDiv.appendChild(grid);
            }}

            chapterDiv.appendChild(header);
            chapterDiv.appendChild(fileListDiv);

            let isOpen = false;
            header.addEventListener('click', () => {{
                if (isOpen) {{
                    fileListDiv.classList.remove('open');
                    toggleSpan.innerHTML = '▶';
                }} else {{
                    fileListDiv.classList.add('open');
                    toggleSpan.innerHTML = '▼';
                }}
                isOpen = !isOpen;
            }});

            container.appendChild(chapterDiv);
        }}
    }}

    function escapeHtml(str) {{
        return str.replace(/[&<>]/g, function(m) {{
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        }});
    }}

    buildCatalog();
</script>
</body>
</html>'''

    output_path = os.path.join(root_dir, 'index.html')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    total_files = sum(len(c['files']) for c in chapter_data)
    print(f'[SUCCESS] 成功生成目录文件：{output_path}')
    print(f'[INFO] 共找到 {len(chapters)} 个符合“第X章”格式的章节，{total_files} 个课件。')
    if total_files == 0:
        print('[WARNING] 未找到任何 .html 课件，请确认章节文件夹内含有课件文件。')

if __name__ == '__main__':
    current_dir = os.path.dirname(os.path.abspath(__file__))
    generate_index(current_dir)