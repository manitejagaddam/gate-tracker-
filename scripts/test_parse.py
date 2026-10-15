import os

def split_by_comma_outside_parens(text):
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
                    parts.append(item)
                current = []
                continue
        current.append(char)
    item = ''.join(current).strip()
    if item:
        parts.append(item)
    return parts

sample1 = "DFA State Minimization (Partitioning / Table-Filling Algorithm), Myhill-Nerode Theorem (Indistinguishable states & Equivalence classes), Closure Properties of Regular Languages (Union, Intersection, Complement, Set Difference, Reversal, Homomorphism, Inverse Homomorphism, Quotient), Regular Pumping Lemma (Contrapositive proof technique & length traps)"
print("Sample 1:")
for i, p in enumerate(split_by_comma_outside_parens(sample1)):
    print(f"  {i+1}. {p}")

sample2 = "C Pointers (Pointer arithmetic, array of pointers vs pointer to 2D array `int (*p)[N]`, function pointers), Strings, Dynamic Memory (`malloc/calloc/free`), Recursion Stack Frame & Static/Global Variable Output Tracing — Solve 30 Timed PYQs"
print("\nSample 2:")
for i, p in enumerate(split_by_comma_outside_parens(sample2)):
    print(f"  {i+1}. {p}")
