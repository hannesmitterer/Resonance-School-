# Kosymbiosis Framework - GitHub Pages Configuration

## Deployment Settings

This repository is configured for GitHub Pages deployment with the following settings:

### Branch Configuration
- **Source Branch**: `main`
- **Source Directory**: `/` (root)

### Custom Domain (Optional)
To use a custom domain:
1. Add a `CNAME` file to the root with your domain
2. Configure DNS settings:
   - Add CNAME record pointing to `hannesmitterer.github.io`
   - Or A records pointing to GitHub Pages IPs

### Build Configuration
- **Build Tool**: None (static site)
- **Entry Point**: `index.html` and `demo.html`
- **Asset Loading**: Relative paths

### IPFS Mirroring
The site is designed to be mirrored on IPFS:
1. All resources use relative paths
2. No server-side dependencies
3. Self-contained modules

## Accessing the Site

### GitHub Pages
Once deployed, the site will be available at:
- Main Portal: `https://hannesmitterer.github.io/Resonance-School-/`
- Demo Dashboard: `https://hannesmitterer.github.io/Resonance-School-/demo.html`

### Local Development
```bash
# Simple HTTP server
python -m http.server 8000

# Or use Node.js
npx http-server -p 8000

# Then visit:
# http://localhost:8000/index.html
# http://localhost:8000/demo.html
```

## Updating the Deployment

### Automatic Deployment
Changes to the `main` branch will automatically trigger a GitHub Pages rebuild.

### Manual IPFS Update
```bash
# Add to IPFS
ipfs add -r .

# Update manifest with new CID
# Edit manifests/final_deployment_manifest.json

# Pin to ensure availability
ipfs pin add <CID>
```

## Security Considerations

1. **No Secrets in Code**: Never commit private keys or sensitive data
2. **HTTPS Only**: GitHub Pages enforces HTTPS by default
3. **Content Security**: IPFS provides content addressing for verification

## Monitoring

Monitor deployment health at:
- GitHub Actions (if configured)
- Browser console for module loading
- Network tab for resource loading

## Support

For deployment issues:
- Check GitHub Pages status
- Review browser console errors
- Verify all resources load correctly
- Test on multiple browsers

## Framework Status

- **Version**: 1.0.043
- **Status**: ETERNAL_ACTIVE
- **Resonance**: 0.043 Hz
- **Last Updated**: 2026-01-03
