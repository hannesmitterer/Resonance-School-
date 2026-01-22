# APE Engine - Autonomous Parameter Evaluator

## Overview
The APE Engine is the validation system for the Resonance School, designed to ensure UVI (Universal Vitality Index) metrics stability and NSR (Non-Slavery Rule) compliance for the Real-Test launching on **January 10, 2026**.

## Components

### 1. `school_params.json`
Configuration file containing:
- **Resonance Target Parameters**: UVI min (40), max (50), optimal (45), tolerance (0.5)
- **Test Data**: Dummy student resonance samples and NSR drift samples
- **System Configuration**: Treasury address, framework, launch date

### 2. `ape_engine.py`
Main validation engine with the following capabilities:

#### Core Functions:
- **`validate_uvi_stability(uvi_value)`**: Validates if a UVI value is within the stable range [40, 50]
- **`validate_sample_data()`**: Validates all student resonance samples from configuration
- **`validate_nsr_drift()`**: Ensures NSR drift remains ≤ 0.001% (Euystacio protocol compliance)
- **`check_optimal_range(uvi_value)`**: Checks if UVI is within optimal range (45 ± 0.5)
- **`run_full_validation()`**: Executes complete validation suite
- **`export_validation_report()`**: Exports validation results to JSON

### 3. `test_ape_engine.py`
Comprehensive test suite validating:
- UVI stability checks (boundary values, edge cases)
- Optimal range detection
- Sample data validation
- NSR drift compliance

## Usage

### Run Full Validation
```bash
python3 ape_engine.py
```

### Run Test Suite
```bash
python3 test_ape_engine.py
```

### Export Validation Report
```python
from ape_engine import APEEngine

engine = APEEngine()
engine.export_validation_report("validation_report.json")
```

### Programmatic Usage
```python
from ape_engine import APEEngine

# Initialize engine
engine = APEEngine("school_params.json")

# Validate individual UVI value
is_valid, message = engine.validate_uvi_stability(42.5)
print(message)  # ✓ UVI 42.5 is stable (within range [40, 50])

# Check if value is optimal
is_optimal, message = engine.check_optimal_range(45.0)
print(message)  # ✓ UVI 45.0 is OPTIMAL (within 0.5 of 45)

# Run full validation
report = engine.run_full_validation()
print(f"Status: {report['overall_status']}")
```

## Validation Criteria

### UVI Stability
- **Valid Range**: 40.0 ≤ UVI ≤ 50.0
- **Optimal Value**: 45.0
- **Tolerance**: ±0.5 from optimal

### NSR Drift
- **Maximum Allowed**: 0.001%
- **Protocol**: Euystacio/Optimus compliance
- **Zero Tolerance**: Any drift > 0.001% triggers FAILED status

## Output Examples

### Console Output
```
============================================================
APE Engine - Autonomous Parameter Evaluator
Resonance School Validation System
============================================================
Configuration: school_params.json
Framework: Euystacio/Optimus
Launch Date: 2026-01-10
============================================================

🔍 UVI Stability Validation
------------------------------------------------------------
  SEED_001: ✓ UVI 42.5 is stable (within range [40, 50])
  SEED_002: ✓ UVI 47.3 is stable (within range [40, 50])
  ...
Summary: 5/5 stable
Stability Rate: 100.0%

🛡️  NSR Drift Validation
------------------------------------------------------------
  2026-01-05T10:00:00Z: ✓ Drift 0.0% ≤ 0.001%
  ...

============================================================
Overall Validation Status: PASSED
============================================================
```

### JSON Report Structure
```json
{
  "overall_status": "PASSED",
  "uvi_validation": {
    "timestamp": "2026-01-05T13:55:36.772457Z",
    "status": "PASSED",
    "validations": [...],
    "summary": {
      "total_samples": 5,
      "stable_samples": 5,
      "unstable_samples": 0,
      "stability_rate": "100.0%"
    }
  },
  "nsr_validation": {
    "timestamp": "2026-01-05T13:55:36.772552Z",
    "status": "PASSED",
    "drift_checks": [...]
  },
  "config": {
    "uvi_range": [40, 50],
    "framework": "Euystacio/Optimus"
  }
}
```

## Framework Compliance

The APE Engine ensures compliance with:
- **Euystacio Protocol**: Ethical AI framework with NSR (Non-Slavery Rule)
- **Optimus Framework**: Predictive integrity monitoring
- **Treasury Address**: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2

## Real-Test Preparation Timeline

- **Current Date**: January 5, 2026
- **Launch Date**: January 10, 2026
- **Status**: Pre-launch validation phase

## Exit Codes

- `0`: Validation PASSED
- `1`: Validation FAILED (UVI or NSR issues)
- `2`: System ERROR (configuration/file issues)

## License
Part of the Resonance School project - Università della Sovranità e Bio-Architettura

---

*"Nothing is final, but the structure is Eternal."*
