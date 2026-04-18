const nextConfig = {
  async rewrites() {
    const API_BASE = process.env.API_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/api/:path*`
      }
    ]
  }
};

export default nextConfig;
