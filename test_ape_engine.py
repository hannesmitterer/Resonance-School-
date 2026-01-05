#!/usr/bin/env python3
"""
Test script for APE Engine validation.
Tests edge cases and validates the functionality.
"""

from ape_engine import APEEngine


def test_uvi_stability():
    """Test UVI stability validation."""
    print("Testing UVI Stability Validation...")
    engine = APEEngine()
    
    # Test values within range
    is_valid, msg = engine.validate_uvi_stability(42.5)
    assert is_valid, "42.5 should be valid"
    print(f"✓ {msg}")
    
    is_valid, msg = engine.validate_uvi_stability(40.0)
    assert is_valid, "40.0 (min) should be valid"
    print(f"✓ {msg}")
    
    is_valid, msg = engine.validate_uvi_stability(50.0)
    assert is_valid, "50.0 (max) should be valid"
    print(f"✓ {msg}")
    
    # Test values outside range
    is_valid, msg = engine.validate_uvi_stability(39.9)
    assert not is_valid, "39.9 should be invalid"
    print(f"✓ {msg}")
    
    is_valid, msg = engine.validate_uvi_stability(50.1)
    assert not is_valid, "50.1 should be invalid"
    print(f"✓ {msg}")
    
    print("✓ All UVI stability tests passed!\n")


def test_optimal_range():
    """Test optimal range checking."""
    print("Testing Optimal Range Validation...")
    engine = APEEngine()
    
    # Test optimal value
    is_optimal, msg = engine.check_optimal_range(45.0)
    assert is_optimal, "45.0 should be optimal"
    print(f"✓ {msg}")
    
    # Test within tolerance
    is_optimal, msg = engine.check_optimal_range(45.5)
    assert is_optimal, "45.5 should be within tolerance"
    print(f"✓ {msg}")
    
    # Test outside tolerance but within range
    is_optimal, msg = engine.check_optimal_range(42.0)
    assert not is_optimal, "42.0 should not be optimal"
    print(f"✓ {msg}")
    
    print("✓ All optimal range tests passed!\n")


def test_sample_validation():
    """Test sample data validation."""
    print("Testing Sample Data Validation...")
    engine = APEEngine()
    
    results = engine.validate_sample_data()
    
    assert results["status"] == "PASSED", "Sample validation should pass"
    assert results["summary"]["total_samples"] == 5, "Should have 5 samples"
    assert results["summary"]["stable_samples"] == 5, "All samples should be stable"
    assert results["summary"]["stability_rate"] == "100.0%", "Stability rate should be 100%"
    
    print(f"✓ Total samples: {results['summary']['total_samples']}")
    print(f"✓ Stable samples: {results['summary']['stable_samples']}")
    print(f"✓ Stability rate: {results['summary']['stability_rate']}")
    print("✓ All sample validation tests passed!\n")


def test_nsr_drift():
    """Test NSR drift validation."""
    print("Testing NSR Drift Validation...")
    engine = APEEngine()
    
    results = engine.validate_nsr_drift()
    
    assert results["status"] == "PASSED", "NSR drift validation should pass"
    assert len(results["drift_checks"]) == 3, "Should have 3 drift checks"
    
    for check in results["drift_checks"]:
        assert check["status"] == "VALID", f"Drift check at {check['timestamp']} should be valid"
    
    print(f"✓ Total drift checks: {len(results['drift_checks'])}")
    print(f"✓ All drift checks passed")
    print("✓ All NSR drift tests passed!\n")


def main():
    """Run all tests."""
    print("=" * 60)
    print("APE Engine Test Suite")
    print("=" * 60)
    print()
    
    try:
        test_uvi_stability()
        test_optimal_range()
        test_sample_validation()
        test_nsr_drift()
        
        print("=" * 60)
        print("✓ All tests passed successfully!")
        print("=" * 60)
        return 0
        
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        return 2


if __name__ == "__main__":
    exit(main())
