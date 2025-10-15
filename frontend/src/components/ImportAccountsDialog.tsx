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

  // Helper functions để convert ID thành tên
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
      alert('Vui lòng chọn file CSV hợp lệ');
    }
  };

  const parseCSV = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        alert('File CSV phải có ít nhất 1 dòng dữ liệu (không tính header)');
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['email', 'full_name', 'phone', 'department_id', 'role_id'];
      
      // Kiểm tra headers
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        alert(`Thiếu các cột bắt buộc: ${missingHeaders.join(', ')}`);
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

        // Parse từng field
        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          switch (header) {
            case 'email':
              account.email = value;
              if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                account.errors.push('Email không hợp lệ');
                account.status = 'invalid';
              }
              break;
            case 'full_name':
              account.full_name = value;
              if (!value) {
                account.errors.push('Họ tên không được để trống');
                account.status = 'invalid';
              }
              break;
            case 'phone':
              account.phone = value;
              if (!value) {
                account.errors.push('Số điện thoại không được để trống');
                account.status = 'invalid';
              }
              break;
            case 'department_id':
              const deptId = parseInt(value);
              if (isNaN(deptId) || deptId <= 0) {
                account.errors.push('ID phòng ban không hợp lệ');
                account.status = 'invalid';
              } else {
                account.department_id = deptId;
              }
              break;
            case 'role_id':
              const roleId = parseInt(value);
              if (isNaN(roleId) || roleId <= 0) {
                account.errors.push('ID vai trò không hợp lệ');
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
      alert('Lỗi khi đọc file CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    const validAccounts = parsedAccounts.filter(acc => acc.status === 'valid');
    
    if (validAccounts.length === 0) {
      alert('Không có tài khoản hợp lệ để import');
      return;
    }

    setImporting(true);
    try {
      const result = await onImport(validAccounts);
      
      // Sử dụng response từ backend thay vì tự tạo
      setImportResult(result);
    } catch (error) {
      console.error('Import error:', error);
      alert('Lỗi khi import tài khoản');
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
    // Tải file template từ public folder
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
          <Typography variant="h6">Import tài khoản từ CSV</Typography>
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
              Tải template CSV:
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlined />}
              onClick={downloadTemplate}
              size="small"
            >
              Tải template
            </Button>
          </Box>

          {/* File upload */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Chọn file CSV:
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
              Chọn file CSV
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                File đã chọn: {file.name}
              </Typography>
            )}
          </Box>

          {/* Processing indicator */}
          {isProcessing && (
            <Box>
              <Typography variant="body2" gutterBottom>
                Đang xử lý file...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {/* Import result */}
          {importResult && (
            <Alert severity={importResult.failed > 0 ? 'warning' : 'success'}>
              <Typography variant="subtitle2">
                Import hoàn tất: {importResult.success} thành công, {importResult.failed} thất bại
              </Typography>
              {importResult.errors.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="error">
                    Lỗi chi tiết:
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
                Xem trước dữ liệu ({parsedAccounts.length} tài khoản):
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Họ tên</TableCell>
                      <TableCell>SĐT</TableCell>
                      <TableCell>Phòng ban</TableCell>
                      <TableCell>Vai trò</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Lỗi</TableCell>
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
                            label={account.status === 'valid' ? 'Hợp lệ' : 'Lỗi'}
                            color={account.status === 'valid' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {account.errors.length > 0 && (
                            <Tooltip title={account.errors.join(', ')}>
                              <Typography variant="caption" color="error">
                                {account.errors.length} lỗi
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
          {importResult ? 'Đóng' : 'Hủy'}
        </Button>
        {!importResult && parsedAccounts.length > 0 && (
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={importing || parsedAccounts.filter(acc => acc.status === 'valid').length === 0}
          >
            {importing ? 'Đang import...' : 'Import tài khoản'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ImportAccountsDialog;
