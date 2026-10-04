import os
import sys

errors = []
required_files = [
    'README.md',
    'submission.yaml',
    'docs/problem-statement.md',
    'docs/solution-overview.md',
    'docs/architecture.md',
    'docs/setup-guide.md',
    'demo/demo-video-link.txt'
]

print("1. Checking required files...")
for f in required_files:
    if not os.path.isfile(f):
        errors.append(f"Missing required file: {f}")
    else:
        print(f"  [OK] {f}")

print("\n2. Validating submission.yaml...")
with open('submission.yaml', 'r', encoding='utf-8') as sf:
    sub_text = sf.read()

req_keys = [
    'Tech Titans',
    'AI',
    'Ronak',
    'ronak18052008@gmail.com',
    'MedSynapse AI',
    'problem_statement:',
    'solution_summary:',
    'key_features:'
]
for k in req_keys:
    if k not in sub_text:
        errors.append(f"submission.yaml missing key string: {k}")
    else:
        print(f"  [OK] Key: {k}")

code_files = []
for root, dirs, files in os.walk('src'):
    dirs[:] = [d for d in dirs if d not in ('node_modules', '__pycache__', '.venv', 'dist', 'build')]
    for f in files:
        if f not in ['README.md', '.env.example']:
            code_files.append(os.path.join(root, f))
print(f"  Found {len(code_files)} code files in src/")
if len(code_files) < 1:
    errors.append("src/ has no code files")

print("\n4. Checking demo video link...")
with open('demo/demo-video-link.txt', 'r', encoding='utf-8') as vf:
    video_first_line = vf.readline().strip()
print(f"  Video link: {video_first_line}")
if 'your-demo-video-link-here' in video_first_line:
    errors.append("demo-video-link.txt has placeholder URL")

print("\n5. Checking README.md for placeholders...")
with open('README.md', 'r', encoding='utf-8') as rf:
    readme_text = rf.read()
if '[Your Project Title Here]' in readme_text or '[Your Team Name]' in readme_text:
    errors.append("README.md still contains template bracket placeholders")
else:
    print("  [OK] README.md has no template placeholders")

print("\n" + "="*50)
if errors:
    print("FAILED with errors:")
    for e in errors:
        print("  x", e)
    sys.exit(1)
else:
    print("ALL SUBMISSION VALIDATION CHECKS PASSED SUCCESSFULLY!")
