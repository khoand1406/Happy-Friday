import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUploadOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  DownloadOutlined,
  CloseOutlined
} from '@mui/icons-material';

interface ImportAccountsDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (accounts: any[]) => Promise<{
    success: number;
    failed: number;
    errors: string[];
  }>;
  departments: Array<{ id: number; name: string }>;
  roles: Array<{ id: number; name: string }>;
}

interface ParsedAccount {
  email: string;
  full_name: string;
  phone: string;
  department_id: number;
  role_id: number;
  password?: string;
  status: 'valid' | 'invalid';
  errors: string[];
}

const ImportAccountsDialog: React.FC<ImportAccountsDialogProps> = ({
  open,
  onClose,
  onImport,
  departments,
  roles
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedAccounts, setParsedAccounts] = useState<ParsedAccount[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    errors: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper functions to convert ID to name
  const getDepartmentName = (id: number) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : `ID: ${id}`;
  };

  const getRoleName = (id: number) => {
    const role = roles.find(r => r.id === id);
    return role ? role.name : `ID: ${id}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const parseCSV = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('CSV must contain at least one data row (excluding header)');
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['email', 'full_name', 'phone', 'department_id', 'role_id'];
      
      // Validate headers
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        alert(`Missing required columns: ${missingHeaders.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      const accounts: ParsedAccount[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const account: ParsedAccount = {
          email: '',
          full_name: '',
          phone: '',
          department_id: 0,
          role_id: 0,
          status: 'valid',
          errors: []
        };

        // Parse each field
        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header) {
            case 'email':
              account.email = value;
              if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                account.errors.push('Invalid email');
                account.status = 'invalid';
              }
              break;
            case 'full_name':
              account.full_name = value;
              if (!value) {
                account.errors.push('Full name is required');
                account.status = 'invalid';
              }
              break;
            case 'phone':
              account.phone = value;
              if (!value) {
                account.errors.push('Phone is required');
                account.status = 'invalid';
              }
              break;
            case 'department_id':
              const deptId = parseInt(value);
              if (isNaN(deptId) || deptId <= 0) {
                account.errors.push('Invalid department_id');
                account.status = 'invalid';
              } else {
                account.department_id = deptId;
              }
              break;
            case 'role_id':
              const roleId = parseInt(value);
              if (isNaN(roleId) || roleId <= 0) {
                account.errors.push('Invalid role_id');
                account.status = 'invalid';
              } else {
                account.role_id = roleId;
              }
              break;
            case 'password':
              account.password = value;
              break;
          }
        });

        accounts.push(account);
      }

      setParsedAccounts(accounts);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error reading CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    const validAccounts = parsedAccounts.filter(acc => acc.status === 'valid');
    
    if (validAccounts.length === 0) {
      alert('No valid accounts to import');
      return;
    }

    setImporting(true);
    try {
      const result = await onImport(validAccounts);
      
      // Normalize any legacy Vietnamese backend messages to English (defensive)
      const viToEn = (msg: string) => {
        return msg
          .replace('Email này đã được đăng ký trong hệ thống', 'This email has already been registered')
          .replace('Địa chỉ email không hợp lệ', 'Invalid email address')
          .replace('Mật khẩu phải có ít nhất 6 ký tự', 'Password must be at least 6 characters');
      };
      const normalized = {
        success: result.success,
        failed: result.failed,
        errors: (result.errors || []).map((e: string) => viToEn(e)),
      };
      
      // Use response from backend (normalized)
      setImportResult(normalized);
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import accounts');
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setParsedAccounts([]);
    setImportResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    // Download template from public folder
    const link = document.createElement('a');
    link.href = '/template_accounts.csv';
    link.download = 'template_accounts.csv';
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Import accounts from CSV</Typography>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* Template download */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              CSV Template:
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={downloadTemplate}
              size="small"
            >
              Download template
            </Button>
          </Box>

          {/* File upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Choose CSV file:
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <Button
              variant="contained"
              startIcon={<CloudUploadOutlined />}
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              Select CSV file
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>

          {/* Processing indicator */}
          {isProcessing && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Processing file...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {/* Import result */}
          {importResult && (
            <Alert severity={importResult.failed > 0 ? 'warning' : 'success'}>
              <Typography variant="subtitle2">
                Import finished: {importResult.success} success, {importResult.failed} failed
              </Typography>
              {importResult.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="error">
                    Details:
                  </Typography>
                  {importResult.errors.map((error, index) => (
                    <Typography key={index} variant="caption" display="block">
                      • {error}
                    </Typography>
                  ))}
                </Box>
              )}
            </Alert>
          )}

          {/* Preview table */}
          {parsedAccounts.length > 0 && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Preview ({parsedAccounts.length} accounts):
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Full name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Errors</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedAccounts.map((account, index) => (
                      <TableRow key={index}>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>{account.full_name}</TableCell>
                        <TableCell>{account.phone}</TableCell>
                        <TableCell>{getDepartmentName(account.department_id)}</TableCell>
                        <TableCell>{getRoleName(account.role_id)}</TableCell>
                        <TableCell>
                          <Chip
                            icon={account.status === 'valid' ? <CheckCircleOutlined /> : <ErrorOutlined />}
                            label={account.status === 'valid' ? 'Valid' : 'Error'}
                            color={account.status === 'valid' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {account.errors.length > 0 && (
                            <Tooltip title={account.errors.join(', ')}>
                              <Typography variant="caption" color="error">
                                {account.errors.length} error(s)
                              </Typography>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {importResult ? 'Close' : 'Cancel'}
        </Button>
        {!importResult && parsedAccounts.length > 0 && (
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={importing || parsedAccounts.filter(acc => acc.status === 'valid').length === 0}
          >
            {importing ? 'Importing...' : 'Import accounts'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportAccountsDialog;
