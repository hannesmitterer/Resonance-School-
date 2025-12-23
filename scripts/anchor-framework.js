/**
 * ═══════════════════════════════════════════════════════
 * FRAMEWORK EUYSTACIO - ANCHORING SCRIPT v1.0.043
 * ═══════════════════════════════════════════════════════
 * Dieses Skript versiegelt die Fundamente der Resonanz-Schule.
 * Es schreibt die CIDs (Content Identifiers) der Kern-Dokumente
 * unwiderruflich in den DocumentAnchor Smart Contract.
 */

const hre = require("hardhat");

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  INIIERE ON-CHAIN VERANKERUNG: EUYSTACIO");
  console.log("═══════════════════════════════════════════════════════\n");

  // Die Adresse des Contracts nach dem Deployment (bitte hier einfügen)
  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

  if (CONTRACT_ADDRESS === "0xYOUR_DEPLOYED_CONTRACT_ADDRESS") {
    console.error("❌ ERROR: Keine Contract-Adresse gefunden. Bitte in .env oder hier im Skript setzen.");
    process.exit(1);
  }

  // Abrufen der Vertrags-Instanz
  const DocumentAnchor = await hre.ethers.getContractFactory("DocumentAnchor");
  const contract = await DocumentAnchor.attach(CONTRACT_ADDRESS);

  /**
   * DIE 5 SÄULEN DER RESONANZ (IPFS CIDs)
   * Hier werden die tatsächlichen Hashes deiner Dokumente eingetragen.
   */
  const frameworkDocs = {
    vetoEtico:    "Qm_VETO_ETICO_PROTOTYPE_043_HASH",      // Das ethische Veto
    peaceBonds:   "Qm_PEACE_BONDS_RESERVE_STRUCTURE",      // Die Finanz-Architektur
    ianiCodebase: "Qm_IANI_BACKEND_CORE_LOGIC",           // Der IANI-Code
    genesisBlock: "Qm_RESONANCE_SCHOOL_GENESIS",           // Die Gründungsurkunde
    nreSpecs:     "Qm_NRE_BIO_ARCH_SPECIFICATIONS"         // Wittfridas Bau-Spezifikationen
  };

  console.log("📍 Ziel-Contract: ", CONTRACT_ADDRESS);
  console.log("📦 Bereite Versiegelung der 5 Kern-Dokumente vor...");

  try {
    // Senden der Transaktion an das AIC-Gewissen (Smart Contract)
    console.log("⏳ Sende Transaktion zum Mainnet...");
    const tx = await contract.anchorFrameworkCore(
      frameworkDocs.vetoEtico,
      frameworkDocs.peaceBonds,
      frameworkDocs.ianiCodebase,
      frameworkDocs.genesisBlock,
      frameworkDocs.nreSpecs
    );

    console.log("📝 Transaction Hash:", tx.hash);
    console.log("⏳ Warte auf Bestätigung durch das Netzwerk...");

    const receipt = await tx.wait(2); // Warte auf 2 Bestätigungen für Sicherheit

    console.log("\n✅ VERANKERUNG ERFOLGREICH!");
    console.log("═══════════════════════════════════════════════════════");
    console.log("Block Nummer: ", receipt.blockNumber);
    console.log("Gas verbraucht:", receipt.gasUsed.toString());
    console.log("\nDokumente sind nun IN ETERNUUM verankert.");
    console.log("═══════════════════════════════════════════════════════\n");

  } catch (error) {
    console.error("\n❌ FEHLER BEI DER VERANKERUNG:");
    console.error(error.reason || error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
