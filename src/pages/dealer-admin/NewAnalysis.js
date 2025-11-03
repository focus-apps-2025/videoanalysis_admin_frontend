import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, Grid, TextField, MenuItem, Button, Typography, Alert,
  Box, LinearProgress, Chip, Paper, IconButton, Tooltip, Container
} from '@mui/material';
import { 
  PlayArrow, Check, Error, Schedule, Refresh, 
  Language, Translate, Link, Add 
} from '@mui/icons-material';
import api from '../../services/api';

// Use the same BMW theme from your dashboard
const MODERN_BMW_THEME = {
  primary: '#1C69D4',
  primaryDark: '#0A4B9C',
  primaryLight: '#4D8FDF',
  primaryUltraLight: '#E8F1FD',
  accent: '#FF6D00',
  accentLight: '#FF9D45',
  accentUltraLight: '#FFF3E8',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  gradientPrimary: 'linear-gradient(135deg, #1C69D4 0%, #0A4B9C 100%)',
  gradientAccent: 'linear-gradient(135deg, #FF6D00 0%, #FF8A00 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
};

const LANGS = [
  { code: "auto", name: "Auto Detect", icon: "🔍" },
  { code: "en", name: "English", icon: "🇺🇸" },
  { code: "as", name: "Assamese", icon: "🇮🇳" },
  { code: "bn", name: "Bengali", icon: "🇮🇳" },
  { code: "gu", name: "Gujarati", icon: "🇮🇳" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
  { code: "kn", name: "Kannada", icon: "🇮🇳" },
  { code: "ml", name: "Malayalam", icon: "🇮🇳" },
  { code: "mr", name: "Marathi", icon: "🇮🇳" },
  { code: "ne", name: "Nepali", icon: "🇳🇵" },
  { code: "or", name: "Odia", icon: "🇮🇳" },
  { code: "pa", name: "Punjabi", icon: "🇮🇳" },
  { code: "sa", name: "Sanskrit", icon: "🇮🇳" },
  { code: "ta", name: "Tamil", icon: "🇮🇳" },
  { code: "te", name: "Telugu", icon: "🇮🇳" },
  { code: "ur", name: "Urdu", icon: "🇵🇰" },
];

const STATUS_CONFIG = {
  pending: { 
    color: 'default', 
    icon: <Schedule sx={{ color: MODERN_BMW_THEME.textTertiary }} />, 
    label: 'Pending',
    bgColor: MODERN_BMW_THEME.surface,
    textColor: MODERN_BMW_THEME.textTertiary
  },
  processing: { 
    color: 'primary', 
    icon: <Refresh sx={{ color: MODERN_BMW_THEME.primary }} />, 
    label: 'Processing',
    bgColor: MODERN_BMW_THEME.primaryUltraLight,
    textColor: MODERN_BMW_THEME.primary
  },
  completed: { 
    color: 'success', 
    icon: <Check sx={{ color: MODERN_BMW_THEME.success }} />, 
    label: 'Completed',
    bgColor: MODERN_BMW_THEME.successLight,
    textColor: MODERN_BMW_THEME.success
  },
  failed: { 
    color: 'error', 
    icon: <Error sx={{ color: MODERN_BMW_THEME.error }} />, 
    label: 'Failed',
    bgColor: MODERN_BMW_THEME.errorLight,
    textColor: MODERN_BMW_THEME.error
  }
};

export default function NewAnalysis() {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('auto');
  const [target, setTarget] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskId, setTaskId] = useState('');
  const [currentTask, setCurrentTask] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Poll for task status
  const pollTaskStatus = async (taskId) => {
    try {
      const response = await api.get(`/analyze-status/${taskId}`);
      setCurrentTask(response.data);
      
      // Stop polling if task is completed or failed
      if (response.data.status === 'completed' || response.data.status === 'failed') {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Error polling task status:', err);
      // If task not found, stop polling
      if (err.response?.status === 404) {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setError('Task not found or expired');
        setLoading(false);
      }
    }
  };

  // Start polling when taskId changes
  useEffect(() => {
    if (taskId && !pollingInterval) {
      const interval = setInterval(() => pollTaskStatus(taskId), 3000);
      setPollingInterval(interval);
      
      // Initial poll
      pollTaskStatus(taskId);
    }
    
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [taskId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTaskId('');
    setCurrentTask(null);

    try {
      const res = await api.post('/analyze', {
        citnow_url: url,
        transcription_language: lang,
        target_language: target
      });
      
      const newTaskId = res.data.task_id;
      if (!newTaskId) {
        throw new Error('No task ID returned from server');
      }
      
      setTaskId(newTaskId);
      setCurrentTask({
        task_id: newTaskId,
        status: 'pending',
        message: 'Queued for processing...'
      });
      
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Analysis failed to start');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setLang('auto');
    setTarget('en');
    setTaskId('');
    setCurrentTask(null);
    setError('');
    setLoading(false);
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  };

  const manuallyCheckStatus = () => {
    if (taskId) {
      pollTaskStatus(taskId);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: MODERN_BMW_THEME.textPrimary,
            mb: 2,
            background: MODERN_BMW_THEME.gradientPrimary,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          New Video Analysis
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: MODERN_BMW_THEME.textSecondary,
            fontWeight: 400,
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Analyze CitNow videos with AI-powered transcription, translation, and quality assessment
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowMd,
            overflow: 'visible'
          }}>
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${MODERN_BMW_THEME.errorLight}`,
                    backgroundColor: MODERN_BMW_THEME.errorLight
                  }}
                  action={
                    <Button 
                      color="inherit" 
                      size="small" 
                      onClick={resetForm}
                      sx={{ fontWeight: 600 }}
                    >
                      Reset
                    </Button>
                  }
                >
                  <Typography variant="body2" fontWeight="600">
                    {error}
                  </Typography>
                </Alert>
              )}
              
              {currentTask && (
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                    border: `1px solid ${MODERN_BMW_THEME.borderLight}`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: MODERN_BMW_THEME.background,
                        border: `1px solid ${MODERN_BMW_THEME.border}`
                      }}>
                        {STATUS_CONFIG[currentTask.status]?.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="600" sx={{ color: STATUS_CONFIG[currentTask.status]?.textColor }}>
                          Analysis {STATUS_CONFIG[currentTask.status]?.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, mt: 0.5 }}>
                          Task ID: {currentTask.task_id}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Chip 
                      label={STATUS_CONFIG[currentTask.status]?.label}
                      sx={{
                        backgroundColor: STATUS_CONFIG[currentTask.status]?.bgColor,
                        color: STATUS_CONFIG[currentTask.status]?.textColor,
                        fontWeight: 600,
                        border: `1px solid ${STATUS_CONFIG[currentTask.status]?.textColor}20`
                      }}
                    />
                  </Box>

                  {currentTask.status === 'processing' && (
                    <Box sx={{ mb: 2 }}>
                      <LinearProgress 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          backgroundColor: MODERN_BMW_THEME.borderLight,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: MODERN_BMW_THEME.primary,
                            borderRadius: 3
                          }
                        }} 
                      />
                    </Box>
                  )}
                  
                  {currentTask.message && (
                    <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textPrimary, mb: 1 }}>
                      {currentTask.message}
                    </Typography>
                  )}
                  
                  {currentTask.status === 'completed' && currentTask.result_id && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.successLight,
                      border: `1px solid ${MODERN_BMW_THEME.success}20`
                    }}>
                      <Check sx={{ color: MODERN_BMW_THEME.success }} />
                      <Typography variant="body2" fontWeight="600" sx={{ color: MODERN_BMW_THEME.success }}>
                        Analysis completed successfully! Result ID: {currentTask.result_id}
                      </Typography>
                    </Box>
                  )}
                  
                  {currentTask.status === 'failed' && currentTask.error_message && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1,
                      p: 2,
                      mt: 2,
                      borderRadius: 2,
                      backgroundColor: MODERN_BMW_THEME.errorLight,
                      border: `1px solid ${MODERN_BMW_THEME.error}20`
                    }}>
                      <Error sx={{ color: MODERN_BMW_THEME.error }} />
                      <Typography variant="body2" fontWeight="600" sx={{ color: MODERN_BMW_THEME.error }}>
                        Error: {currentTask.error_message}
                      </Typography>
                    </Box>
                  )}

                  {currentTask.status === 'processing' && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="outlined"
                        size="small"
                        startIcon={<Refresh />}
                        onClick={manuallyCheckStatus}
                        sx={{
                          borderColor: MODERN_BMW_THEME.primary,
                          color: MODERN_BMW_THEME.primary,
                          fontWeight: 500
                        }}
                      >
                        Refresh Status
                      </Button>
                    </Box>
                  )}
                </Paper>
              )}

              <form onSubmit={submit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Link sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                          <span>CitNow Video URL</span>
                        </Box>
                      }
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)} 
                      required 
                      disabled={loading || currentTask}
                      helperText="Enter the full URL of your CitNow video for analysis"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: MODERN_BMW_THEME.background,
                        }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      select 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Language sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                          <span>Spoken Language</span>
                        </Box>
                      }
                      value={lang} 
                      onChange={(e) => setLang(e.target.value)}
                      disabled={loading || currentTask}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: MODERN_BMW_THEME.background,
                        }
                      }}
                    >
                      {LANGS.map(l => (
                        <MenuItem key={l.code} value={l.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body1">{l.icon}</Typography>
                            <Typography>{l.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      select 
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Translate sx={{ color: MODERN_BMW_THEME.textSecondary, fontSize: 20 }} />
                          <span>Target Language</span>
                        </Box>
                      }
                      value={target} 
                      onChange={(e) => setTarget(e.target.value)}
                      disabled={loading || currentTask}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: MODERN_BMW_THEME.background,
                        }
                      }}
                    >
                      {LANGS.filter(l => l.code !== 'auto').map(l => (
                        <MenuItem key={l.code} value={l.code}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Typography variant="body1">{l.icon}</Typography>
                            <Typography>{l.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading || currentTask}
                        startIcon={<PlayArrow />}
                        sx={{
                          background: MODERN_BMW_THEME.gradientPrimary,
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '16px',
                          boxShadow: MODERN_BMW_THEME.shadowMd,
                          '&:hover': {
                            boxShadow: MODERN_BMW_THEME.shadowLg,
                            transform: 'translateY(-1px)'
                          },
                          '&:disabled': {
                            background: MODERN_BMW_THEME.textTertiary,
                            transform: 'none'
                          },
                          transition: 'all 0.2s ease-in-out',
                          minWidth: 140
                        }}
                      >
                        {loading ? 'Starting...' : 'Start Analysis'}
                      </Button>
                      
                      {(currentTask && (currentTask.status === 'completed' || currentTask.status === 'failed')) && (
                        <Button 
                          variant="outlined" 
                          onClick={resetForm}
                          startIcon={<Add />}
                          sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '16px',
                            borderColor: MODERN_BMW_THEME.primary,
                            color: MODERN_BMW_THEME.primary,
                            '&:hover': {
                              backgroundColor: MODERN_BMW_THEME.primaryUltraLight,
                              borderColor: MODERN_BMW_THEME.primaryDark
                            }
                          }}
                        >
                          New Analysis
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
              
              {/* Help section */}
              {!currentTask && (
                <Paper 
                  elevation={0}
                  sx={{
                    p: 3,
                    mt: 4,
                    borderRadius: 2,
                    backgroundColor: MODERN_BMW_THEME.surface,
                    border: `1px solid ${MODERN_BMW_THEME.borderLight}`
                  }}
                >
                  <Typography variant="h6" fontWeight="600" sx={{ color: MODERN_BMW_THEME.textPrimary, mb: 1 }}>
                    💡 How it works
                  </Typography>
                  <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textSecondary, lineHeight: 1.6 }}>
                    • Analysis runs in the background - you can continue using the dashboard<br/>
                    • Real-time progress tracking with automatic status updates<br/>
                    • Comprehensive video, audio, and transcription analysis<br/>
                    • Results available immediately upon completion
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}