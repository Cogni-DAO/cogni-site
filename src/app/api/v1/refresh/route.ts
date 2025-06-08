export async function POST() {
    try {
        const backendUrl = process.env.FASTAPI_URL;
        if (!backendUrl) {
            throw new Error('FASTAPI_URL environment variable is not set');
        }

        const response = await fetch(`${backendUrl}/api/v1/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Backend request failed: ${response.status}`);
        }

        const data = await response.json();

        return Response.json(data, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Refresh API error:', error);
        return Response.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 