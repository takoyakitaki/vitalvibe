# 🔧 Health System - Quick Reference Guide

## Files Modified

### ✏️ pages/profile.html
**Changes:**
- Added "📊 สถิติร่างกาย" section after "✏️ แก้ไขโปรไฟล์"
- Location: Between Edit Profile and Rewards sections (lines 83-196)
- Added 3 new JavaScript functions (lines 349-465)
- Added `loadBodyStats()` call at page load

### ✏️ pages/health.html
**Changes:**
- Updated header with link to body statistics (line 31-34)
- Added subtitle "ติดตามค่าสุขภาพประจำวัน"
- Green button "📊 สถิติร่างกาย →" links to profile page
- No functional changes to daily tracking

---

## HTML Structure

### Body Statistics Section
```html
<div id="bodyStatsContent" class="hidden">
  <!-- Summary Card (auto-populated from latest data) -->
  <div id="bodyStatsSummary">...</div>
  
  <!-- Input Form -->
  <form class="space-y-3">
    <!-- Basic: height, weight, waist, hip -->
    <!-- Blood Tests: muscle, bloodfat, bloodsugar, bloodpressure -->
  </form>
  
  <!-- Access Control Checkboxes -->
  <div class="space-y-2">
    <input id="access_height">
    <input id="access_weight">
    <input id="access_waist_hip">
    <input id="access_bloodtest">
  </div>
  
  <!-- Save Button -->
  <button onclick="saveBodyStats()">💾 บันทึก</button>
</div>
```

---

## Field IDs Reference

### Input Fields (Measurements)
| Field ID | Label | Type | Unit | Placeholder |
|----------|-------|------|------|-------------|
| `bs_height` | ส่วนสูง | number | cm | 170 |
| `bs_weight` | น้ำหนัก | number | kg | 65 |
| `bs_waist` | รอบเอว | number | cm | 80 |
| `bs_hip` | รอบสะโพก | number | cm | 95 |
| `bs_muscle` | กล้ามเนื้อ | number | % | 45 |
| `bs_bloodfat` | ไขมันเลือด | number | mg/dL | 180 |
| `bs_bloodsugar` | น้ำตาล | number | mg/dL | 100 |
| `bs_bloodpressure` | ความดัน | text | mmHg | 120/80 |

### Access Control Checkboxes
| Checkbox ID | Description | Default |
|-------------|-------------|---------|
| `access_height` | Allow height viewing | ✅ Checked |
| `access_weight` | Allow weight viewing | ✅ Checked |
| `access_waist_hip` | Allow waist/hip viewing | ❌ Unchecked |
| `access_bloodtest` | Allow blood test viewing | ❌ Unchecked |

### Display Elements
| Element ID | Content | Updates |
|------------|---------|---------|
| `statsHeight` | Latest height | On load & save |
| `statsWeight` | Latest weight | On load & save |
| `statsWaist` | Latest waist | On load & save |
| `statsHip` | Latest hip | On load & save |
| `bodyStatsToggleIcon` | Toggle icon | On click |
| `bodyStatsContent` | Content container | On click |

---

## Data Flow Diagram

```
User Interface (HTML)
        ↓
    JavaScript Functions
        ↓
   Firestore Database
   
Toggle Section:
  toggleBodyStats() → Update DOM visibility

Save Data:
  saveBodyStats() → Validate → addDoc(bodyStats) → updateDoc(users)

Load Data:
  loadBodyStats() → getDocs(bodyStats) → getDoc(users) → Update DOM
```

---

## Function Reference

### `toggleBodyStats()`
```javascript
- Toggle display of bodyStatsContent
- Rotate icon 180° when expanding
- No data operations
- Runs instantly
```

### `saveBodyStats()`
```javascript
- Read all form input values
- Validate at least one field filled
- Parse numeric values
- Create bodyStats document
- Update user.bodyStatsAccess
- Show success alert
- Clear form
- Reload stats
```

### `loadBodyStats()`
```javascript
- Query bodyStats collection
- Get latest record by createdAt
- Update summary card display
- Pre-fill form with values
- Load access control settings
- Set checkboxes accordingly
```

---

## Firestore Operations

### Collections Used
```
firestore
├── bodyStats/          (NEW - detailed measurements)
│   └── [auto-id]
│       ├── uid
│       ├── height, weight, waist, hip
│       ├── muscle, bloodfat, bloodsugar, bloodpressure
│       └── createdAt
│
└── users/[uid]         (UPDATED)
    ├── displayName
    ├── email
    ├── avatar
    ├── calorieGoal
    ├── wallet
    └── bodyStatsAccess  (NEW)
        ├── height
        ├── weight
        ├── waist_hip
        ├── bloodtest
        └── updatedAt
```

---

## Common Issues & Fixes

### Issue: Form not pre-filling
**Cause:** `loadBodyStats()` not called or bodyStats collection empty
**Fix:** 
- Check `loadBodyStats()` called at page load
- Verify first entry exists in bodyStats
- Check console for errors

### Issue: Toggles not working
**Cause:** Event listener not attached or selector wrong
**Fix:**
- Verify `onclick="toggleBodyStats()"` on header div
- Check `bodyStatsContent` ID exists
- Check CSS class `hidden` applies display:none

### Issue: Data not saving
**Cause:** Missing fields, validation error, or Firebase permission
**Fix:**
- Check at least one field filled
- Check browser console for exact error
- Verify Firestore security rules allow writes
- Ensure `addDoc()` and `updateDoc()` have correct paths

### Issue: Summary card not updating
**Cause:** Latest data not found or display IDs mismatch
**Fix:**
- Verify bodyStats collection has entries
- Check `statsHeight`, `statsWeight`, etc. IDs exist
- Ensure orderBy('createdAt', 'desc') works
- Check Firestore has correct timestamps

---

## Performance Tips

1. **Query Optimization:**
   - `loadBodyStats()` queries only latest record
   - Uses orderBy with descending order
   - Limits results to first document

2. **Form Efficiency:**
   - Pre-fills form to enable quick updates
   - Reduces re-entry time for regular users

3. **Data Storage:**
   - Each entry is separate Firestore document
   - Access control stored in user doc (single read)
   - History can be queried separately if needed

---

## Testing Commands (Browser Console)

```javascript
// Check if functions exist
typeof toggleBodyStats        // "function"
typeof saveBodyStats          // "function"
typeof loadBodyStats          // "function"

// Manually call functions
toggleBodyStats()             // Toggle section
saveBodyStats()               // Try to save (validates)
loadBodyStats()               // Reload latest data

// Check element values
document.getElementById('bs_height').value
document.getElementById('access_height').checked
```

---

## Related Documentation

- [HEALTH_SYSTEM_REFACTOR.md](HEALTH_SYSTEM_REFACTOR.md) - Full implementation guide
- [README.md](README.md) - Project overview
- [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) - Project roadmap
- [SYSTEM_ARCHITECTURE_SUMMARY.md](SYSTEM_ARCHITECTURE_SUMMARY.md) - Architecture overview

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-20 | Initial implementation |
| | | - Body statistics section added to profile |
| | | - Access control toggles implemented |
| | | - Health page simplified with link |
| | | - Full Firestore integration |

---

**Last Updated:** June 20, 2026  
**Status:** ✅ Production Ready
