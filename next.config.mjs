/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['legal-books.vercel.app', 'randomuser.me', 'ui-avatars.com','api.legalbooks.in', "legalbooksdev.s3.amazonaws.com", ".env"],
  },
  
}

export default nextConfig;