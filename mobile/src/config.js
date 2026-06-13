/**
 * ─── App Configuration ────────────────────────────────────────────────────────
 *
 * UPDATE ONLY THIS FILE when you change networks.
 * Run this in PowerShell to get your IP:
 *   Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike '*Loopback*' } | Select IPAddress, InterfaceAlias
 */

export const LAN_IP   = '10.171.53.200';
export const API_PORT  = 1600;
export const WEB_PORT  = 5173;

export const BACKEND_URL   = `http://${LAN_IP}:${API_PORT}/api`;
export const SOCKET_URL    = `http://${LAN_IP}:${API_PORT}`;
export const VIDEO_BASE_URL = `http://${LAN_IP}:${WEB_PORT}`;
