"""
Clean server startup script for Windows
Suppresses asyncio pipe warnings
"""
import sys
import warnings

# Suppress ResourceWarning for asyncio pipes on Windows
if sys.platform == 'win32':
    warnings.filterwarnings('ignore', category=ResourceWarning)
    import asyncio
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
