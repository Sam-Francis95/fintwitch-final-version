# Install Real Pathway on Windows

## Prerequisites: Update WSL2 First

1. **Open PowerShell as Administrator**
   - Press Windows key
   - Type "PowerShell"
   - Right-click → "Run as administrator"

2. **Update WSL:**
   ```powershell
   wsl --update
   ```

3. **Install Ubuntu (if not already):**
   ```powershell
   wsl --install -d Ubuntu
   ```

4. **Restart your computer**

## Install Real Pathway

1. **Open Ubuntu (WSL2):**
   - Press Windows key
   - Type "Ubuntu"
   - Open Ubuntu app

2. **Navigate to your project:**
   ```bash
   cd /mnt/c/Users/lenovo/Desktop/fin_final2/backend
   ```

3. **Create Python virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

4. **Install real Pathway:**
   ```bash
   pip install -U pathway
   pip install -r requirements.txt
   ```

5. **Verify installation:**
   ```bash
   python -c "import pathway as pw; print(hasattr(pw, 'Schema'))"
   ```
   Should output: `True`

6. **Run the server:**
   ```bash
   python pathway_streaming_v2.py
   ```

You should see: `✓ Using REAL Pathway streaming engine`

## Then Access from Windows

- Backend API: http://localhost:8000
- Frontend: Run from Windows normally

The Pathway engine runs in WSL2, frontend in Windows.
