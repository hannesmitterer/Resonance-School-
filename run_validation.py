#!/usr/bin/env python3
"""
Automated validation runner for Resonance School.
Runs full validation suite and reports results.
"""

import sys
from pathlib import Path

def main():
    """Run automated validation."""
    print("🏛️  Resonance School - Automated Validation Runner")
    print("=" * 70)
    print()
    
    # Check if files exist
    required_files = ['school_params.json', 'ape_engine.py']
    missing_files = []
    
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Error: Missing required files: {', '.join(missing_files)}")
        return 1
    
    print("✓ All required files found")
    print()
    
    # Import and run validation
    try:
        from ape_engine import APEEngine
        
        print("📋 Running validation suite...")
        print()
        
        engine = APEEngine()
        results = engine.run_full_validation()
        
        print()
        print("=" * 70)
        
        if results['overall_status'] == 'PASSED':
            print("✅ VALIDATION SUCCESSFUL - System ready for Real-Test")
            print()
            print("Summary:")
            print(f"  • UVI Stability: {results['uvi_validation']['summary']['stability_rate']}")
            print(f"  • NSR Compliance: VERIFIED")
            print(f"  • Framework: {results['config']['framework']}")
            print()
            print("Next Steps:")
            print("  1. Review validation_report.json for detailed results")
            print("  2. Monitor UVI values daily until January 10, 2026")
            print("  3. Maintain NSR drift at 0.000%")
            return 0
        else:
            print("❌ VALIDATION FAILED - Issues detected")
            print()
            print("Please review the validation output above for specific issues.")
            print("Common issues:")
            print("  • UVI values outside range [40, 50]")
            print("  • NSR drift exceeds 0.001%")
            return 1
            
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("Please ensure ape_engine.py is in the current directory.")
        return 2
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return 2

if __name__ == "__main__":
    sys.exit(main())
