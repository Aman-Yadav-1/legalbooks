export default async function handler(req: { method: string; body: { code: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: any; data?: any; }): void; new(): any; }; }; }) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { code } = req.body;
  
    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }
  
    try {
      const apiResponse = await fetch('https://api.legalbooks.in/api/v1/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, request_type:'login' }),
      });
  
      const apiData = await apiResponse.json();
  
      if (!apiResponse.ok) {
        return res.status(apiResponse.status).json({ message: apiData.message || 'Error from target API' });
      }
  
      res.status(200).json({ message: 'Success', data: apiData });
    } catch (error) {
      console.error('Error sending code to target API:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }