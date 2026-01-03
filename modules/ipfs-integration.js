/**
 * ═══════════════════════════════════════════════════════
 * IPFS INTEGRATION UTILITIES
 * ═══════════════════════════════════════════════════════
 * Decentralized storage integration for the Resonance School
 * Provides immutable proof of contributions and artifacts
 */

class IPFSIntegration {
  constructor() {
    this.gatewayUrl = 'https://ipfs.io/ipfs/';
    this.pinataGateway = 'https://gateway.pinata.cloud/ipfs/';
    this.documents = {};
    this.manifestPath = '../manifests/final_deployment_manifest.json';
  }

  /**
   * Initialize IPFS integration
   */
  async initialize() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  IPFS INTEGRATION INITIALIZATION');
    console.log('═══════════════════════════════════════════════════════');
    
    await this.loadDocuments();
    console.log('✅ IPFS Integration initialized');
    console.log('   Gateway: ' + this.gatewayUrl);
    console.log('   Documents loaded: ' + Object.keys(this.documents).length);
    
    return this;
  }

  /**
   * Load IPFS documents from manifest
   */
  async loadDocuments() {
    try {
      const response = await fetch(this.manifestPath);
      const manifest = await response.json();
      
      if (manifest.IPFSAnchoring && manifest.IPFSAnchoring.documents) {
        this.documents = manifest.IPFSAnchoring.documents;
        this.gatewayUrl = manifest.IPFSAnchoring.gatewayUrl || this.gatewayUrl;
      }
    } catch (error) {
      console.warn('⚠️ Could not load IPFS manifest, using defaults');
      this.setDefaultDocuments();
    }
  }

  /**
   * Set default documents
   */
  setDefaultDocuments() {
    this.documents = {
      genesisBlock: 'QmResonanceSchoolTruth20251226HannesMitterer',
      vetoEtico: 'Qm_VETO_ETICO_PROTOTYPE_043_HASH',
      peaceBonds: 'Qm_PEACE_BONDS_RESERVE_STRUCTURE',
      ianiCodebase: 'Qm_IANI_BACKEND_CORE_LOGIC',
      nreSpecs: 'Qm_NRE_BIO_ARCH_SPECIFICATIONS'
    };
  }

  /**
   * Get IPFS URL for a document
   */
  getDocumentUrl(documentKey, useAlternateGateway = false) {
    const cid = this.documents[documentKey];
    if (!cid) {
      console.warn('Document not found: ' + documentKey);
      return null;
    }

    const gateway = useAlternateGateway ? this.pinataGateway : this.gatewayUrl;
    return gateway + cid;
  }

  /**
   * Get all documents with URLs
   */
  getAllDocuments() {
    return Object.entries(this.documents).map(([key, cid]) => ({
      key,
      cid,
      url: this.gatewayUrl + cid,
      alternateUrl: this.pinataGateway + cid
    }));
  }

  /**
   * Add a new document CID
   */
  addDocument(key, cid) {
    this.documents[key] = cid;
    console.log('📎 Document added to IPFS registry: ' + key + ' -> ' + cid);
    
    // Emit event
    const event = new CustomEvent('ipfs:document-added', {
      detail: { key, cid, url: this.getDocumentUrl(key) }
    });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }

  /**
   * Verify document accessibility
   */
  async verifyDocument(documentKey) {
    const url = this.getDocumentUrl(documentKey);
    if (!url) return false;

    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Document verification failed for ' + documentKey + ': ' + error.message);
      return false;
    }
  }

  /**
   * Verify all documents
   */
  async verifyAllDocuments() {
    console.log('🔍 Verifying all IPFS documents...');
    
    const results = {};
    for (const key of Object.keys(this.documents)) {
      results[key] = await this.verifyDocument(key);
    }
    
    const successCount = Object.values(results).filter(v => v).length;
    console.log('✅ Verification complete: ' + successCount + '/' + Object.keys(results).length + ' accessible');
    
    return results;
  }

  /**
   * Generate IPFS link HTML
   */
  generateDocumentLink(documentKey, label = null) {
    const url = this.getDocumentUrl(documentKey);
    if (!url) return '';

    const displayLabel = label || this.formatDocumentKey(documentKey);
    const cid = this.documents[documentKey];

    return `
      <div class="ipfs-document-link">
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="ipfs-link">
          <span class="document-icon">📄</span>
          <span class="document-label">${displayLabel}</span>
        </a>
        <code class="cid-display" title="${cid}">${this.truncateCID(cid)}</code>
      </div>
    `;
  }

  /**
   * Format document key for display
   */
  formatDocumentKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Truncate CID for display
   */
  truncateCID(cid) {
    if (cid.length <= 20) return cid;
    return cid.substring(0, 10) + '...' + cid.substring(cid.length - 8);
  }

  /**
   * Render document library
   */
  renderDocumentLibrary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const documents = this.getAllDocuments();
    
    const html = `
      <div class="ipfs-library">
        <div class="library-header">
          <h3>📚 Immutable Document Library</h3>
          <p>All documents are stored on IPFS for eternal access</p>
        </div>
        <div class="document-grid">
          ${documents.map(doc => `
            <div class="document-card">
              <div class="document-header">
                <span class="document-icon">📄</span>
                <h4>${this.formatDocumentKey(doc.key)}</h4>
              </div>
              <div class="document-cid">
                <code>${doc.cid}</code>
              </div>
              <div class="document-actions">
                <a href="${doc.url}" target="_blank" class="btn-primary">
                  View on IPFS
                </a>
                <a href="${doc.alternateUrl}" target="_blank" class="btn-secondary">
                  Alternate Gateway
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * Get IPFS statistics
   */
  getStatistics() {
    return {
      totalDocuments: Object.keys(this.documents).length,
      gatewayUrl: this.gatewayUrl,
      documents: this.documents
    };
  }

  /**
   * Export configuration
   */
  exportConfiguration() {
    return {
      gatewayUrl: this.gatewayUrl,
      pinataGateway: this.pinataGateway,
      documents: this.documents,
      timestamp: new Date().toISOString()
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IPFSIntegration;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.IPFSIntegration = IPFSIntegration;
  
  // Create global instance
  window.ipfs = new IPFSIntegration();
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.ipfs.initialize();
    });
  } else {
    window.ipfs.initialize();
  }
}
