#!/usr/bin/env python3
"""
APE Engine - Autonomous Parameter Evaluator
Resonance School validation engine for UVI metrics and NSR drift monitoring.

Purpose: Validate resonance metrics stability for Real-Test preparation (Jan 10, 2026)
Framework: Euystacio/Optimus compliance
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple, Optional


class APEEngine:
    """Autonomous Parameter Evaluator for Resonance School metrics."""
    
    def __init__(self, config_path: str = "school_params.json"):
        """
        Initialize APE Engine with configuration.
        
        Args:
            config_path: Path to school_params.json configuration file
        """
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.validation_results = []
        
    def _load_config(self) -> Dict:
        """Load configuration from school_params.json."""
        try:
            with open(self.config_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Configuration file not found: {self.config_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in configuration file: {e}")
    
    def validate_uvi_stability(self, uvi_value: float) -> Tuple[bool, str]:
        """
        Validate if UVI (Resonance) value is stable within acceptable range [40, 50].
        
        Args:
            uvi_value: The UVI value to validate
            
        Returns:
            Tuple of (is_valid, message)
        """
        uvi_min = self.config["resonance_target"]["uvi_min"]
        uvi_max = self.config["resonance_target"]["uvi_max"]
        
        if uvi_min <= uvi_value <= uvi_max:
            return True, f"✓ UVI {uvi_value} is stable (within range [{uvi_min}, {uvi_max}])"
        else:
            return False, f"✗ UVI {uvi_value} is UNSTABLE (outside range [{uvi_min}, {uvi_max}])"
    
    def validate_sample_data(self) -> Dict:
        """
        Validate all sample data from configuration.
        
        Returns:
            Dictionary with validation results
        """
        results = {
            "timestamp": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            "status": "PASSED",
            "validations": [],
            "summary": {}
        }
        
        # Validate student resonance samples
        if "test_data" in self.config and "student_resonance_samples" in self.config["test_data"]:
            samples = self.config["test_data"]["student_resonance_samples"]
            stable_count = 0
            unstable_count = 0
            
            for sample in samples:
                student_id = sample["id"]
                uvi = sample["uvi"]
                is_valid, message = self.validate_uvi_stability(uvi)
                
                results["validations"].append({
                    "student_id": student_id,
                    "uvi": uvi,
                    "status": "STABLE" if is_valid else "UNSTABLE",
                    "message": message
                })
                
                if is_valid:
                    stable_count += 1
                else:
                    unstable_count += 1
            
            results["summary"]["total_samples"] = len(samples)
            results["summary"]["stable_samples"] = stable_count
            results["summary"]["unstable_samples"] = unstable_count
            results["summary"]["stability_rate"] = f"{(stable_count/len(samples)*100):.1f}%"
            
            if unstable_count > 0:
                results["status"] = "FAILED"
        
        return results
    
    def validate_nsr_drift(self) -> Dict:
        """
        Validate NSR (Non-Slavery Rule) drift values.
        
        Returns:
            Dictionary with NSR drift validation results
        """
        results = {
            "timestamp": datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z'),
            "status": "PASSED",
            "drift_checks": []
        }
        
        if "test_data" in self.config and "nsr_drift_samples" in self.config["test_data"]:
            samples = self.config["test_data"]["nsr_drift_samples"]
            max_allowed_drift = 0.001  # 0.001% as per Euystacio protocol
            
            for sample in samples:
                drift = sample["drift"]
                timestamp = sample["timestamp"]
                is_valid = drift <= max_allowed_drift
                
                results["drift_checks"].append({
                    "timestamp": timestamp,
                    "drift": drift,
                    "status": "VALID" if is_valid else "INVALID",
                    "message": f"{'✓' if is_valid else '✗'} Drift {drift}% {'≤' if is_valid else '>'} {max_allowed_drift}%"
                })
                
                if not is_valid:
                    results["status"] = "FAILED"
        
        return results
    
    def check_optimal_range(self, uvi_value: float) -> Tuple[bool, str]:
        """
        Check if UVI value is within optimal range with tolerance.
        
        Args:
            uvi_value: The UVI value to check
            
        Returns:
            Tuple of (is_optimal, message)
        """
        optimal = self.config["resonance_target"].get("optimal_uvi", 45)
        tolerance = self.config["resonance_target"].get("tolerance", 0.5)
        
        if abs(uvi_value - optimal) <= tolerance:
            return True, f"✓ UVI {uvi_value} is OPTIMAL (within {tolerance} of {optimal})"
        else:
            deviation = abs(uvi_value - optimal)
            return False, f"○ UVI {uvi_value} is acceptable but not optimal (deviation: {deviation:.2f})"
    
    def run_full_validation(self) -> Dict:
        """
        Run complete validation suite.
        
        Returns:
            Complete validation report
        """
        print("=" * 60)
        print("APE Engine - Autonomous Parameter Evaluator")
        print("Resonance School Validation System")
        print("=" * 60)
        print(f"Configuration: {self.config_path}")
        print(f"Framework: {self.config.get('system_config', {}).get('framework', 'N/A')}")
        print(f"Launch Date: {self.config.get('system_config', {}).get('launch_date', 'N/A')}")
        print("=" * 60)
        print()
        
        # UVI Stability Validation
        print("🔍 UVI Stability Validation")
        print("-" * 60)
        uvi_results = self.validate_sample_data()
        
        for validation in uvi_results["validations"]:
            print(f"  {validation['student_id']}: {validation['message']}")
        
        print()
        print(f"Summary: {uvi_results['summary']['stable_samples']}/{uvi_results['summary']['total_samples']} stable")
        print(f"Stability Rate: {uvi_results['summary']['stability_rate']}")
        print()
        
        # NSR Drift Validation
        print("🛡️  NSR Drift Validation")
        print("-" * 60)
        nsr_results = self.validate_nsr_drift()
        
        for check in nsr_results["drift_checks"]:
            print(f"  {check['timestamp']}: {check['message']}")
        
        print()
        
        # Overall Status
        overall_status = "PASSED" if (uvi_results["status"] == "PASSED" and 
                                      nsr_results["status"] == "PASSED") else "FAILED"
        
        print("=" * 60)
        print(f"Overall Validation Status: {overall_status}")
        print("=" * 60)
        
        return {
            "overall_status": overall_status,
            "uvi_validation": uvi_results,
            "nsr_validation": nsr_results,
            "config": {
                "uvi_range": [
                    self.config["resonance_target"]["uvi_min"],
                    self.config["resonance_target"]["uvi_max"]
                ],
                "framework": self.config.get("system_config", {}).get("framework", "N/A")
            }
        }
    
    def export_validation_report(self, output_path: str = "validation_report.json") -> None:
        """
        Export validation report to JSON file.
        
        Args:
            output_path: Path to output file
        """
        report = self.run_full_validation()
        
        with open(output_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📄 Validation report exported to: {output_path}")


def main():
    """Main entry point for APE Engine."""
    try:
        engine = APEEngine()
        report = engine.run_full_validation()
        
        # Exit with appropriate code
        sys.exit(0 if report["overall_status"] == "PASSED" else 1)
        
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
