class Solution(object):
    def solve(self, s1, s2):
        counter = {chr(i):0 for i in range(ord('a'), ord('z')+1)}
        for c in s1:
            counter[c] += 1
        for c in s2:
            counter[c] -= 1
        for k,v in counter.items():
            if v != 0:
                return False
        return True