# Render Migration Checklist

## Pre-Migration ✅

- [x] Replaced deprecated ScriptProcessorNode with AudioWorkletNode
- [x] Created AudioWorklet processor file
- [x] Added global error handler to server
- [x] Added graceful shutdown to server
- [x] Created render.yaml configuration
- [x] Updated frontend URL for Render backend
- [x] Backup current Railway environment variables

## Migration Steps

### 1. Create Render Account
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Verify email

### 2. Create New Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select `Batmeez-Bot-main` repository
- [ ] Configure settings:
  - [ ] Name: `batmeez-bot-backend`
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: `Free`
  - [ ] Health Check Path: `/health`

### 3. Environment Variables
In Render dashboard → Environment → Environment Variables:
- [ ] `GEMINI_API_KEY=your_gemini_api_key`
- [ ] `PORT=3001`
- [ ] `FRONTEND_URL=https://your-vercel-app.vercel.app`
- [ ] `NODE_ENV=production`

### 4. Deploy and Test
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete
- [ ] Test health endpoint: `https://your-app.onrender.com/health`
- [ ] Verify WebSocket connectivity

### 5. Update Frontend
- [ ] Update `BACKEND_URL` in App.tsx (already done)
- [ ] Commit and push changes
- [ ] Wait for Vercel auto-deploy

### 6. Final Testing
- [ ] Visit frontend URL
- [ ] Test voice chat functionality
- [ ] Check browser console for errors
- [ ] Verify WebSocket connects to Render

## Post-Migration

### 7. Cleanup
- [ ] Delete Railway service (after 48 hours of testing)
- [ ] Remove railway.json files
- [ ] Update documentation

### 8. Monitoring
- [ ] Check Render dashboard for first 24 hours
- [ ] Monitor error rates
- [ ] Verify free tier usage

## Rollback Plan (if needed)

If migration fails:
```bash
# Revert frontend URL
const BACKEND_URL = 'wss://batmeez-app-production.up.railway.app';

# Commit and push
git add App.tsx
git commit -m "Rollback to Railway backend"
git push origin main
```

## Success Criteria

- [ ] All endpoints respond correctly
- [ ] WebSocket connections work
- [ ] Voice chat functionality intact
- [ ] No API key exposure
- [ ] CORS properly configured
- [ ] Zero downtime experienced
- [ ] Free tier limits respected

## Important Notes

- Render URL will be: `https://batmeez-bot-backend.onrender.com`
- Keep Railway running for 48 hours as backup
- Monitor free tier usage (750 hours/month)
- WebSocket connections use WSS (secure) in production

## Troubleshooting

### Common Issues
1. **WebSocket fails**: Check URL uses `wss://` not `ws://`
2. **CORS errors**: Verify `FRONTEND_URL` matches exactly
3. **Build fails**: Check `package.json` in server directory
4. **API key errors**: Ensure environment variables are set

### Debug Commands
```bash
# Test health endpoint
curl https://your-app.onrender.com/health

# Check WebSocket connection
wscat -c wss://your-app.onrender.com

# Monitor logs in Render dashboard
```
