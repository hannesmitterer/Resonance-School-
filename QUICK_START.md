# Resonance School Validation System - Quick Start Guide

## Overview
This guide helps you get started with the APE Engine validation system for the Resonance School Real-Test preparation (January 10, 2026).

## Files Created

1. **school_params.json** - Configuration with dummy test data
2. **ape_engine.py** - Main validation engine
3. **test_ape_engine.py** - Test suite
4. **APE_ENGINE_README.md** - Comprehensive documentation
5. **.gitignore** - Excludes generated files from git

## Quick Validation

### Run Validation (Recommended)
```bash
python3 ape_engine.py
```

Expected output:
- ✓ All 5 student samples stable (UVI range: 40-50)
- ✓ All 3 NSR drift checks passed (≤ 0.001%)
- Overall Status: PASSED

### Run Tests
```bash
python3 test_ape_engine.py
```

Expected: All tests pass (UVI stability, optimal range, sample data, NSR drift)

### Generate Report
```bash
python3 -c "from ape_engine import APEEngine; APEEngine().export_validation_report()"
```

Output: Creates `validation_report.json` with detailed results

## Key Validation Metrics

### UVI (Universal Vitality Index)
- **Valid Range**: 40.0 to 50.0
- **Optimal**: 45.0 (±0.5 tolerance)
- **Current Test Data**: All 5 samples within range (100% stability)

### NSR (Non-Slavery Rule) Drift
- **Maximum Allowed**: 0.001%
- **Current Test Data**: All samples at 0.000% (perfect compliance)

## System Configuration

From `school_params.json`:
- Framework: Euystacio/Optimus
- Treasury: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2
- Launch Date: 2026-01-10
- Status: pre_launch_validation

## Programmatic Usage Example

```python
from ape_engine import APEEngine

# Initialize engine
engine = APEEngine()

# Validate single UVI value
is_stable, msg = engine.validate_uvi_stability(45.0)
print(msg)  # ✓ UVI 45.0 is stable (within range [40, 50])

# Check if optimal
is_optimal, msg = engine.check_optimal_range(45.0)
print(msg)  # ✓ UVI 45.0 is OPTIMAL (within 0.5 of 45)

# Run full validation
results = engine.run_full_validation()
print(f"Status: {results['overall_status']}")  # Status: PASSED
```

## Integration with Real Data

To use with real data, modify `school_params.json`:

1. Update `test_data.student_resonance_samples` with actual student UVI readings
2. Update `test_data.nsr_drift_samples` with actual NSR measurements
3. Run validation: `python3 ape_engine.py`

## Troubleshooting

### Validation FAILED
- Check UVI values are within [40, 50]
- Ensure NSR drift ≤ 0.001%
- Review `validation_report.json` for specific failures

### Import Errors
```bash
# Ensure Python 3.6+ is installed
python3 --version

# Verify files are in same directory
ls -la ape_engine.py school_params.json
```

### File Not Found
```bash
# Run from repository root
cd /path/to/Resonance-School-
python3 ape_engine.py
```

## Support

For detailed documentation, see `APE_ENGINE_README.md`

## Timeline

- **Development**: January 5, 2026 ✓
- **Validation Ready**: January 5, 2026 ✓
- **Real-Test Launch**: January 10, 2026

---

*Automated validation system for Resonance School - "Nothing is final, but the structure is Eternal."*
