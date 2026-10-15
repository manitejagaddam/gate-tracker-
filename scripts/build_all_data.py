import csv
import json
import os
import re

CSV_DIR = os.path.join(os.getcwd(), "csv files")

def split_points(text):
    if not text:
        return []
    parts = []
    current = []
    depth = 0
    in_quote = False
    for char in text:
        if char == '"':
            in_quote = not in_quote
        elif not in_quote:
            if char in '([{<':
                depth += 1
            elif char in ')]}>':
                depth = max(0, depth - 1)
            elif char == ',' and depth == 0:
                item = ''.join(current).strip()
                if item:
                    # Clean leading bullet if any
                    item = re.sub(r'^[•\-\*]\s*', '', item)
                    parts.append(item)
                current = []
                continue
        current.append(char)
    item = ''.join(current).strip()
    if item:
        item = re.sub(r'^[•\-\*]\s*', '', item)
        parts.append(item)
    return parts

# 1. Parse 116-Day Detailed Plan
plan_csv = os.path.join(CSV_DIR, "GATE_2027_CSE_AIR_Top10_Master_Workbook-116-Day Detailed Plan.csv")
schedule_days = []

with open(plan_csv, "r", encoding="utf-8-sig", errors="replace") as f:
    reader = csv.reader(f)
    rows = list(reader)

# Header is at row index 4 (5th line)
header = rows[4]
print(f"Plan Header columns ({len(header)}): {header}")

for row_idx in range(5, len(rows)):
    r = rows[row_idx]
    if not r or len(r) < 5:
        continue
    day_str = r[0].strip()
    if not day_str.startswith("Day "):
        continue
    
    day_id = int(day_str.replace("Day ", "").strip())
    date_str = r[1].strip()
    weekday = r[2].strip()
    phase = r[3].strip()
    
    b1_subj = r[4].strip()
    b1_topics = r[5].strip()
    b1_pyq = r[6].strip()
    
    b2_subj = r[7].strip()
    b2_topics = r[8].strip()
    
    b3_subj = r[9].strip()
    b3_topics = r[10].strip()
    
    target_q = r[11].strip()
    target_hrs = r[12].strip()
    status = r[14].strip() if len(r) > 14 else "Pending"

    # Category determination
    phase_lower = phase.lower()
    b1_lower = b1_subj.lower()
    if "holiday" in phase_lower or "holiday" in b1_lower or "zero work" in phase_lower:
        cat = "holiday"
    elif "mock" in phase_lower or "mock" in b1_lower:
        cat = "mock"
    elif "phase 1" in phase_lower:
        cat = "phase1"
    elif "phase 2" in phase_lower:
        cat = "phase2"
    elif "phase 3" in phase_lower:
        cat = "phase3"
    elif "phase 4" in phase_lower:
        cat = "phase4"
    else:
        cat = "phase1"

    # Primary syllabus subject code
    combined_subj = f"{b1_subj} {b2_subj}".lower()
    if cat == "holiday":
        syl_subj = "Holiday"
    elif cat == "mock":
        syl_subj = "Mock"
    elif "theory of computation" in combined_subj or "toc" in combined_subj:
        syl_subj = "TOC"
    elif "compiler" in combined_subj or "cd" in combined_subj:
        syl_subj = "CD"
    elif "networks" in combined_subj or "cn" in combined_subj:
        syl_subj = "CN"
    elif "operating" in combined_subj or "os" in combined_subj:
        syl_subj = "OS"
    elif "database" in combined_subj or "dbms" in combined_subj:
        syl_subj = "DBMS"
    elif "data structures" in combined_subj or "programming" in combined_subj or "algorithm" in combined_subj:
        syl_subj = "DS & Algo"
    elif "computer organization" in combined_subj or "coa" in combined_subj:
        syl_subj = "COA"
    elif "digital" in combined_subj:
        syl_subj = "Digital Logic"
    elif "math" in combined_subj:
        syl_subj = "Math"
    else:
        syl_subj = "CSE"

    schedule_days.append({
        "id": day_id,
        "day": day_str,
        "date": date_str,
        "isoDate": date_str,
        "weekday": weekday,
        "phase": phase,
        "category": cat,
        "sylSubj": syl_subj,
        
        # Block 1
        "b1Subject": b1_subj,
        "b1Topics": b1_topics,
        "b1Points": split_points(b1_topics),
        "b1PyqDrill": b1_pyq,
        "b1PyqPoints": split_points(b1_pyq),
        
        # Block 2
        "b2Subject": b2_subj,
        "b2Topics": b2_topics,
        "b2Points": split_points(b2_topics),
        
        # Block 3
        "b3Subject": b3_subj,
        "b3Topics": b3_topics,
        "b3Points": split_points(b3_topics),
        
        # Full legacy string representations for backward compatibility
        "b1": f"{b1_subj}: {b1_topics} | {b1_pyq}" if b1_topics else b1_subj,
        "b2": f"{b2_subj}: {b2_topics}" if b2_topics else b2_subj,
        "b3": f"{b3_subj}: {b3_topics}" if b3_topics else b3_subj,
        "air10Ext": f"4h Compact Mode: {b1_subj} ({target_q} Qs Target)" if target_hrs != "0.00" and cat != "holiday" else "",
        
        "targetQ": f"{target_q} Qs/Day" if target_q and target_q != "0" else "0 Qs (Rest)",
        "targetQuestions": int(target_q) if target_q and target_q.isdigit() else 0,
        "targetStudyHrs": float(target_hrs) if target_hrs else 0.0,
        "status": status,
        "pyqOnlyA": f"{b1_subj}: {b1_pyq}" if b1_pyq else b1_subj,
        "pyqOnlyB": f"{b2_subj} (Revision Drill)",
        "pyqOnlyC": f"{b3_subj} (Foundation Drill)",
    })

print(f"Extracted {len(schedule_days)} study days successfully (Day 1 to {schedule_days[-1]['day']}).")

# 2. Parse Executive Dashboard
dash_csv = os.path.join(CSV_DIR, "GATE_2027_CSE_AIR_Top10_Master_Workbook-Executive Dashboard.csv")
with open(dash_csv, "r", encoding="utf-8-sig", errors="replace") as f:
    dash_rows = list(csv.reader(f))

# Table 1: Subject-Wise Weightage
subject_weightages = []
for r in dash_rows[9:20]: # rows 10 to 20
    if len(r) >= 9:
        subject_weightages.append({
            "subject": r[0].strip(),
            "completion": r[1].strip(),
            "m2023": float(r[2].strip()) if r[2].strip() else 0,
            "m2024": float(r[3].strip()) if r[3].strip() else 0,
            "m2025": float(r[4].strip()) if r[4].strip() else 0,
            "avgMarks": float(r[5].strip()) if r[5].strip() else 0,
            "targetMarks": float(r[6].strip()) if r[6].strip() else 0,
            "dominantTypes": r[7].strip(),
            "frequentTopics": r[8].strip(),
            "frequentPoints": split_points(r[8].strip()),
        })

# Table 2: Question Type Shifts
question_shifts = []
for r in dash_rows[25:29]: # rows 26 to 29
    if len(r) >= 6:
        question_shifts.append({
            "year": r[0].strip(),
            "mcq": float(r[1].strip()) if r[1].strip() else 0,
            "msq": float(r[2].strip()) if r[2].strip() else 0,
            "nat": float(r[3].strip()) if r[3].strip() else 0,
            "total": float(r[4].strip()) if r[4].strip() else 0,
            "implication": r[5].strip(),
        })

dashboard_data = {
    "totalPrepWindow": "116 Days (104 Study Days + 12 Telugu Festival Holidays)",
    "syllabusCompletion": "Nov 13, 2026 (21 Active Days: TOC 75%, CD 100%, CN 75%)",
    "totalQuestionTarget": "8,793 Questions (Timed Topic PYQs + 16 Mocks + 15 Past Papers)",
    "targetScoreBenchmark": "85.0+ / 100 (GA: 14.5+ | Math: 12.0+ | Core CS: 58.5+)",
    "subjectWeightages": subject_weightages,
    "questionShifts": question_shifts,
}

print(f"Extracted {len(subject_weightages)} subject weightages and {len(question_shifts)} question shifts.")

# 3. Parse High-Yield Topic Checklist
check_csv = os.path.join(CSV_DIR, "GATE_2027_CSE_AIR_Top10_Master_Workbook-High-Yield Topic Checklist.csv")
with open(check_csv, "r", encoding="utf-8-sig", errors="replace") as f:
    check_rows = list(csv.reader(f))

checklist_items = []
for idx, r in enumerate(check_rows[4:56]): # rows 5 to 56
    if len(r) >= 10:
        checklist_items.append({
            "id": idx + 1,
            "subject": r[0].strip(),
            "topic": r[1].strip(),
            "tier": r[2].strip(),
            "typicalMarks": float(r[3].strip()) if r[3].strip() else 0.0,
            "format": r[4].strip(),
            "recurringTrap": r[5].strip(),
            "trapPoints": split_points(r[5].strip()),
            "scheduledDays": r[6].strip(),
            "pass1": r[7].strip(),
            "pass2": r[8].strip(),
            "pass3": r[9].strip(),
        })

print(f"Extracted {len(checklist_items)} high-yield topic checklist items.")

# 4. Parse Mock & Holiday Log
mock_csv = os.path.join(CSV_DIR, "GATE_2027_CSE_AIR_Top10_Master_Workbook-Mock & Holiday Log.csv")
with open(mock_csv, "r", encoding="utf-8-sig", errors="replace") as f:
    mock_rows = list(csv.reader(f))

mock_tests = []
for idx, r in enumerate(mock_rows[5:21]): # rows 6 to 21 (Mocks 1-16)
    if len(r) >= 5:
        scope = r[3].strip()
        mock_tests.append({
            "id": idx + 1,
            "mockNumber": r[0].strip(),
            "date": r[1].strip(),
            "weekday": r[2].strip(),
            "scope": scope,
            "scopePoints": split_points(scope),
            "targetScore": float(r[4].strip()) if r[4].strip() else 0.0,
        })

holidays = []
for idx, r in enumerate(mock_rows[26:38]): # rows 27 to 38 (Holidays 1-12)
    if len(r) >= 6:
        holidays.append({
            "id": idx + 1,
            "holidayNumber": r[0].strip(),
            "date": r[1].strip(),
            "weekday": r[2].strip(),
            "name": r[3].strip(),
            "targetHrs": float(r[4].strip()) if r[4].strip() else 0.0,
            "rule": r[5].strip(),
            "rulePoints": split_points(r[5].strip()),
        })

print(f"Extracted {len(mock_tests)} weekly mocks and {len(holidays)} festival holidays.")

# Output all JSON files into src/data/
DATA_DIR = os.path.join(os.getcwd(), "src", "data")
os.makedirs(DATA_DIR, exist_ok=True)

with open(os.path.join(DATA_DIR, "schedule-data.json"), "w", encoding="utf-8") as f:
    json.dump(schedule_days, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "dashboard-data.json"), "w", encoding="utf-8") as f:
    json.dump(dashboard_data, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "checklist-data.json"), "w", encoding="utf-8") as f:
    json.dump(checklist_items, f, indent=2, ensure_ascii=False)

with open(os.path.join(DATA_DIR, "mock-holiday-data.json"), "w", encoding="utf-8") as f:
    json.dump({"mocks": mock_tests, "holidays": holidays}, f, indent=2, ensure_ascii=False)

print("All 4 dataset JSON files generated successfully in src/data/!")
