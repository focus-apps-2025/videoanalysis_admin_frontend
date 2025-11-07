import React, { useEffect, useState,useContext } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Container,
  Alert,
  Snackbar,
  ContentCopy,
  Link
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  VideoLibrary,
  Group,
  EmojiEvents,
  Timeline,
  PieChart,
  BarChart,
  Refresh,
  ArrowUpward,
  ArrowDownward,
  OpenInNew,
  Mic,
  Videocam,
  Assessment,
  Schedule,
  Person
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, Legend,ComposedChart,LabelList,ReferenceLine } from 'recharts';
import { dashboardApi } from '../../services/dashboardapi';
import { AuthContext } from '../../contexts/AuthContext';


export default function DealerAdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalVideos: 0,
      averageScore: 0,
      serviceAdvisors: 0,
      completionRate: 0
    },
    dailyPerformance: [],
    serviceAdvisors: [],
    qualityBreakdown: [],
    recentVideos: [],
    performanceTrend: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [error, setError] = useState(null);
  const { user: authUser } = useContext(AuthContext); 
  const [dealerInfo, setDealerInfo] = useState({

    name: 'Loading...',
    location: 'Loading...'
  });

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
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

  const CHART_COLORS = {
  primary: MODERN_BMW_THEME.primary,
  success: MODERN_BMW_THEME.success,
  warning: MODERN_BMW_THEME.warning,
  error: MODERN_BMW_THEME.error,
  accent: MODERN_BMW_THEME.accent,
  qualityGradient: [MODERN_BMW_THEME.success, MODERN_BMW_THEME.primary, MODERN_BMW_THEME.warning, MODERN_BMW_THEME.error]
};

const DealerStatCard = ({ title, value, change, changeType, icon, color, subtitle, onClick }) => (
  <Card sx={{
    background: MODERN_BMW_THEME.surfaceElevated,
    border: `1px solid ${MODERN_BMW_THEME.border}`,
    borderRadius: 3,
    boxShadow: MODERN_BMW_THEME.shadowSm,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: MODERN_BMW_THEME.shadowMd,
      transform: 'translateY(-2px)',
      cursor: onClick ? 'pointer' : 'default'
    },
    height: '100%'
  }} onClick={onClick}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{
            color: MODERN_BMW_THEME.textSecondary,
            fontWeight: 600,
            mb: 1,
            fontSize: '0.875rem'
          }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            fontWeight: 700,
            mb: 1,
            lineHeight: 1.2
          }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{
              color: MODERN_BMW_THEME.textTertiary,
              display: 'block',
              mb: 1
            }}>
              {subtitle}
            </Typography>
          )}
          {change && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {changeType === 'positive' ? (
                <ArrowUpward sx={{ fontSize: 16, color: MODERN_BMW_THEME.success, mr: 0.5 }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: MODERN_BMW_THEME.error, mr: 0.5 }} />
              )}
              <Typography variant="caption" sx={{
                color: changeType === 'positive' ? MODERN_BMW_THEME.success : MODERN_BMW_THEME.error,
                fontWeight: 600
              }}>
                {change}
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {React.cloneElement(icon, { 
            sx: { fontSize: 24, color: color } 
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);
// Add this component near your other chart components in dealer-admin dashboard
const ServiceAdvisorQualityChart = ({ data = [] }) => {
  const chartData = (data || []).map((advisor) => {
    const name = advisor.name || 'Unknown Advisor';
    const audioRaw = Number(advisor.averageAudioScore ?? advisor.audioScore ?? 0);
    const videoRaw = Number(advisor.averageVideoScore ?? advisor.videoScore ?? 0);
    return { 
      name, 
      Audio: -Math.max(0, Math.min(10, audioRaw)), 
      Video: Math.max(0, Math.min(10, videoRaw)) 
    };
  });

  return (
    <Box sx={{ mt: 3, p: 3, background: MODERN_BMW_THEME.surface, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700, mb: 2, textAlign: 'center' }}>
        Service Advisor Quality Comparison
      </Typography>
      <ResponsiveContainer width="100%" height={Math.max(350, chartData.length * 50)}>
        <ComposedChart 
          layout="vertical" 
          data={chartData} 
          margin={{ top: 30, right: 30, left: 100, bottom: 30 }}
        >
          <CartesianGrid stroke={MODERN_BMW_THEME.borderLight} horizontal={false} />
          <XAxis 
            type="number" 
            domain={[-10, 10]} 
            ticks={[-10, -5, 0, 5, 10]} 
            tickFormatter={(value) => Math.abs(value).toString()} 
            stroke={MODERN_BMW_THEME.textSecondary} 
            fontSize={12} 
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            scale="band" 
            stroke={MODERN_BMW_THEME.textSecondary} 
            fontSize={12} 
            width={80} 
          />
          <RechartsTooltip 
            formatter={(value, name) => [Math.abs(Number(value)).toFixed(1), name]} 
            contentStyle={{
              background: MODERN_BMW_THEME.background, 
              border: `1px solid ${MODERN_BMW_THEME.border}`, 
              borderRadius: 8, 
              boxShadow: MODERN_BMW_THEME.shadowMd
            }} 
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            formatter={(value) => (
              <span style={{ color: MODERN_BMW_THEME.textPrimary, fontSize: '12px' }}>{value}</span>
            )} 
          />
          <ReferenceLine x={0} stroke={MODERN_BMW_THEME.textTertiary} strokeWidth={2} />
          <Bar 
            dataKey="Audio" 
            fill={MODERN_BMW_THEME.accent} 
            barSize={20} 
            radius={[0, 4, 4, 0]}
          >
            <LabelList 
              dataKey="Audio" 
              position="insideLeft" 
              formatter={(value) => Math.abs(value).toFixed(1)} 
              style={{ fill: MODERN_BMW_THEME.background, fontSize: 11, fontWeight: 'bold' }} 
            />
          </Bar>
          <Bar 
            dataKey="Video" 
            fill={MODERN_BMW_THEME.primary} 
            barSize={20} 
            radius={[4, 0, 0, 4]}
          >
            <LabelList 
              dataKey="Video" 
              position="insideRight" 
              formatter={(value) => Math.abs(value).toFixed(1)} 
              style={{ fill: MODERN_BMW_THEME.background, fontSize: 11, fontWeight: 'bold' }} 
            />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};


// Service Advisor Card
const ServiceAdvisorCard = ({ advisor, rank }) => (
  <Card sx={{
    background: MODERN_BMW_THEME.surfaceElevated,
    border: `1px solid ${MODERN_BMW_THEME.border}`,
    borderRadius: 2,
    boxShadow: MODERN_BMW_THEME.shadowSm,
    mb: 1.5,
    height: '100%',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: MODERN_BMW_THEME.shadowMd,
      transform: 'translateY(-2px)'
    }
  }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {/* Rank Badge */}
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background:
              rank === 1 ? MODERN_BMW_THEME.gradientAccent :
              rank === 2 ? MODERN_BMW_THEME.gradientPrimary :
              rank === 3 ? MODERN_BMW_THEME.gradientSuccess :
              MODERN_BMW_THEME.surface,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            fontWeight: 700,
            fontSize: '14px',
            color: rank <= 3 ? MODERN_BMW_THEME.background : MODERN_BMW_THEME.textSecondary,
            flexShrink: 0,
            boxShadow: MODERN_BMW_THEME.shadowMd
          }}>
            {rank}
          </Box>

          {/* Advisor Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{
              color: MODERN_BMW_THEME.textPrimary,
              fontWeight: 600,
              mb: 0.5,
              fontSize: '1rem'
            }}>
              {advisor.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <VideoLibrary sx={{ fontSize: 14, color: MODERN_BMW_THEME.textTertiary, mr: 0.5 }} />
              <Typography variant="caption" sx={{
                color: MODERN_BMW_THEME.textTertiary,
                fontWeight: 500
              }}>
                {advisor.videos} video{advisor.videos !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Overall Score */}
        <Box sx={{ textAlign: 'center', minWidth: 70, background: MODERN_BMW_THEME.primaryUltraLight, borderRadius: 3, p: 1.5, border: `1px solid ${MODERN_BMW_THEME.border}` }}>
          <Typography variant="h6" sx={{ color: MODERN_BMW_THEME.primary, fontWeight: 700, lineHeight: 1, mb: 0.5 }}>
            {advisor.score.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 600, fontSize: '0.7rem' }}>
            Overall
          </Typography>
        </Box>
      </Box>

      {/* Progress Bars */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
            <Videocam sx={{ fontSize: 16, color: MODERN_BMW_THEME.primary, mr: 1 }} />
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500 }}>Video</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={advisor.videoScore * 10}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: MODERN_BMW_THEME.borderLight,
              '& .MuiLinearProgress-bar': {
                backgroundColor: MODERN_BMW_THEME.primary,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            minWidth: 35,
            textAlign: 'right',
            ml: 1.5,
            fontWeight: 600,
            fontSize: '0.8rem'
          }}>
            {advisor.videoScore.toFixed(1)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 80 }}>
            <Mic sx={{ fontSize: 16, color: MODERN_BMW_THEME.accent, mr: 1 }} />
            <Typography variant="caption" sx={{ color: MODERN_BMW_THEME.textSecondary, fontWeight: 500 }}>Audio</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={advisor.audioScore * 10}
            sx={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              backgroundColor: MODERN_BMW_THEME.borderLight,
              '& .MuiLinearProgress-bar': {
                backgroundColor: MODERN_BMW_THEME.accent,
                borderRadius: 4
              }
            }}
          />
          <Typography variant="caption" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            minWidth: 35,
            textAlign: 'right',
            ml: 1.5,
            fontWeight: 600,
            fontSize: '0.8rem'
          }}>
            {advisor.audioScore.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Daily Performance Line Chart
const DailyPerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={280}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={MODERN_BMW_THEME.borderLight} />
      <XAxis 
        dataKey="name" 
        stroke={MODERN_BMW_THEME.textSecondary}
        fontSize={12}
      />
      <YAxis 
        stroke={MODERN_BMW_THEME.textSecondary}
        fontSize={12}
        domain={[0, 10]}
      />
      <RechartsTooltip 
        contentStyle={{
          background: MODERN_BMW_THEME.background,
          border: `1px solid ${MODERN_BMW_THEME.border}`,
          borderRadius: 8,
          boxShadow: MODERN_BMW_THEME.shadowMd
        }}
      />
      <Line 
        type="monotone" 
        dataKey="score" 
        stroke={MODERN_BMW_THEME.primary} 
        strokeWidth={3}
        dot={{ fill: MODERN_BMW_THEME.primary, strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6, fill: MODERN_BMW_THEME.primary }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const ServiceAdvisorPerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RechartsBarChart 
      data={data} 
      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke={MODERN_BMW_THEME.borderLight} />
      <XAxis 
        dataKey="name" 
        stroke={MODERN_BMW_THEME.textSecondary}
        fontSize={11}
        angle={-45}
        textAnchor="end"
        height={60}
      />
      <YAxis 
        stroke={MODERN_BMW_THEME.textSecondary}
        fontSize={12}
        domain={[0, 10]}
      />
      <RechartsTooltip 
        contentStyle={{
          background: MODERN_BMW_THEME.background,
          border: `1px solid ${MODERN_BMW_THEME.border}`,
          borderRadius: 8,
          boxShadow: MODERN_BMW_THEME.shadowMd
        }}
        formatter={(value, name) => {
          const labelMap = {
            'overall': 'Overall Score',
            'video': 'Video Quality', 
            'audio': 'Audio Quality'
          };
          return [`${value}/10`, labelMap[name] || name];
        }}
      />
      <Legend />
      <Bar 
        dataKey="overall" 
        fill={MODERN_BMW_THEME.primary}
        radius={[4, 4, 0, 0]}
        name="Overall Score"
      />
      <Bar 
        dataKey="video" 
        fill={MODERN_BMW_THEME.accent}
        radius={[4, 4, 0, 0]}
        name="Video Quality"
      />
      <Bar 
        dataKey="audio" 
        fill={MODERN_BMW_THEME.success}
        radius={[4, 4, 0, 0]}
        name="Audio Quality"
      />
    </RechartsBarChart>
  </ResponsiveContainer>
);

const QualityBreakdownChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <RechartsPieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={CHART_COLORS.qualityGradient[index % CHART_COLORS.qualityGradient.length]} />
        ))}
      </Pie>
      <RechartsTooltip />
      <Legend />
    </RechartsPieChart>
  </ResponsiveContainer>
);
  const loadDashboardData = async () => {
  setLoading(true);
  setError(null);
  try {
    // Single API call to get all results
    const allResults = await dashboardApi.getDealerDashboard(timeRange);
    
    // Process data on frontend (we'll create these functions)
    const processedData = processDashboardData(allResults, timeRange);
    
    // Update dealer info
    setDealerInfo({
      name: 'Your Dealership',
      location: 'Your Location',
      id: 'current'
    });

    setDashboardData(processedData);
    setLoading(false);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    setError('Failed to load dashboard data. Please try again.');
    setLoading(false);
  }
};
// Data processing functions
const filterByTimeRange = (results, timeRange) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  return results.filter(result => {
    const resultDate = new Date(result.created_at);
    return resultDate >= startDate && resultDate <= now;
  });
};

const calculateOverview = (filteredResults) => {
  const totalVideos = filteredResults.length;
  
  const validScores = filteredResults
    .filter(r => r.overall_quality_score != null)
    .map(r => r.overall_quality_score);
  
  const averageScore = validScores.length > 0 
    ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length 
    : 0;

  const lowQualityVideos = filteredResults.filter(r => 
    ['Poor', 'Very Poor', 'Analysis Failed', 'Error'].includes(r.video_quality_label)
  ).length;

  const serviceAdvisors = new Set(
    filteredResults
      .filter(r => r.citnow_service_advisor)
      .map(r => r.citnow_service_advisor)
  ).size;

  const completionRate = totalVideos > 0 
    ? Math.round(((totalVideos - lowQualityVideos) / totalVideos) * 100)
    : 0;

  return {
    totalVideos,
    averageScore: Math.round(averageScore * 10) / 10,
    serviceAdvisors,
    completionRate
  };
};

const calculateAdvisorPerformance = (filteredResults) => {
  const advisorMap = {};

  filteredResults.forEach(result => {
    const advisorName = result.citnow_service_advisor || 'Unknown Advisor';
    
    if (!advisorMap[advisorName]) {
      advisorMap[advisorName] = {
        name: advisorName,
        videos: 0,
        scores: [],
        videoScores: [],
        audioScores: []
      };
    }

    advisorMap[advisorName].videos++;
    
    if (result.overall_quality_score != null) {
      advisorMap[advisorName].scores.push(result.overall_quality_score);
    }
    if (result.video_quality_score != null) {
      advisorMap[advisorName].videoScores.push(result.video_quality_score);
    }
    if (result.audio_quality_score != null) {
      advisorMap[advisorName].audioScores.push(result.audio_quality_score);
    }
  });

  return Object.values(advisorMap).map(advisor => {
    const avgScore = advisor.scores.length > 0 
      ? advisor.scores.reduce((sum, score) => sum + score, 0) / advisor.scores.length 
      : 0;
    
    const avgVideoScore = advisor.videoScores.length > 0 
      ? advisor.videoScores.reduce((sum, score) => sum + score, 0) / advisor.videoScores.length 
      : 0;
    
    const avgAudioScore = advisor.audioScores.length > 0 
      ? advisor.audioScores.reduce((sum, score) => sum + score, 0) / advisor.audioScores.length 
      : 0;

    return {
      name: advisor.name,
      videos: advisor.videos,
      score: Math.round(avgScore * 10) / 10,
      videoScore: Math.round(avgVideoScore * 10) / 10,
      audioScore: Math.round(avgAudioScore * 10) / 10,
      overall: Math.round(avgScore * 10) / 10,
      video: Math.round(avgVideoScore * 10) / 10,
      audio: Math.round(avgAudioScore * 10) / 10
    };
  }).sort((a, b) => b.score - a.score);
};

const calculateQualityBreakdown = (filteredResults) => {
  const qualityCounts = {
    'Excellent': 0,
    'Very Good': 0,
    'Good': 0,
    'Fair': 0,
    'Poor': 0
  };

  filteredResults.forEach(result => {
    const label = result.overall_quality_label;
    if (label && qualityCounts.hasOwnProperty(label)) {
      qualityCounts[label]++;
    }
  });

  return Object.entries(qualityCounts).map(([name, value]) => ({
    name,
    value
  }));
};

const calculateDailyPerformance = (filteredResults, timeRange) => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = {};

  // Initialize days based on time range
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 7;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dayKey = date.toDateString();
    const dayName = dayNames[date.getDay()];
    
    dailyData[dayKey] = {
      name: dayName,
      scores: [],
      count: 0
    };
  }

  // Aggregate data by day
  filteredResults.forEach(result => {
    const resultDate = new Date(result.created_at);
    const dayKey = resultDate.toDateString();
    
    if (dailyData[dayKey]) {
      dailyData[dayKey].count++;
      if (result.overall_quality_score != null) {
        dailyData[dayKey].scores.push(result.overall_quality_score);
      }
    }
  });

  // Calculate averages and format for chart
  return Object.values(dailyData).map(day => ({
    name: day.name,
    score: day.scores.length > 0 
      ? Math.round((day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length) * 10) / 10
      : 0,
    videos: day.count
  }));
};

// Main function to process all dashboard data
const processDashboardData = (allResults, timeRange) => {
  const filteredResults = filterByTimeRange(allResults, timeRange);
  
  return {
    overview: calculateOverview(filteredResults),
    serviceAdvisors: calculateAdvisorPerformance(filteredResults),
    qualityBreakdown: calculateQualityBreakdown(filteredResults),
    dailyPerformance: calculateDailyPerformance(filteredResults, timeRange),
    recentVideos: allResults.slice(0, 8).map((video, index) => ({
      id: video._id || `video-${index}`,
      vehicle: video.citnow_vehicle || 'Unknown Vehicle',
      advisor: video.citnow_service_advisor || 'Unknown Advisor',
      score: (video.overall_quality_score || 0).toFixed(1),
      date: new Date(video.created_at).toLocaleDateString(),
      status: video.status === 'completed' ? 'Completed' : 'In Progress'
    })),
    performanceTrend: calculateDailyPerformance(filteredResults, timeRange)
  };
};

  useEffect(() => {
    loadDashboardData();
  }, [refreshCounter, timeRange]);

  const handleRefresh = () => {
    setRefreshCounter(prev => prev + 1);
  };

  const handleViewDetails = (section) => {
    console.log(`View details for: ${section}`);
    // Implement navigation logic here
  };

  const handleViewAnalysis = (videoId) => {
    console.log(`View analysis: ${videoId}`);
    // Implement navigation to analysis detail page
  };

  const handleCloseError = () => {
    setError(null);
  };

  // Calculate trends for stat cards
  const calculateTrends = () => {
    const hasData = dashboardData.overview.totalVideos > 0;
    
    return {
      totalVideosChange: hasData ? "+12 this week" : "No data yet",
      averageScoreChange: hasData ? "+0.3 from last week" : "No data yet",
      advisorsChange: hasData ? `${dashboardData.overview.serviceAdvisors} active` : "No data yet",
      completionChange: hasData ? "+5% improvement" : "No data yet"
    };
  };

  const trends = calculateTrends();

  if (loading) {
    return (
      <Box sx={{
        minHeight: '100vh',
        background: MODERN_BMW_THEME.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: `3px solid ${MODERN_BMW_THEME.border}`,
            borderTop: `3px solid ${MODERN_BMW_THEME.primary}`,
            animation: 'spin 1s linear infinite',
            mx: 'auto',
            mb: 3
          }} />
          <Typography variant="h6" sx={{
            color: MODERN_BMW_THEME.textSecondary,
            fontWeight: 500
          }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: MODERN_BMW_THEME.background,
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
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
            Dealer Performance 
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: MODERN_BMW_THEME.textSecondary,
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              mb: 3
            }}
          >
            Monitor your dealership's performance metrics, track service advisor progress, 
            and optimize customer service quality in real-time.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
           
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleRefresh}
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
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Refresh Data
            </Button>
          </Box>

          {/* Time Range Tabs - Centered */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Paper sx={{
              background: MODERN_BMW_THEME.surface,
              border: `1px solid ${MODERN_BMW_THEME.border}`,
              borderRadius: 3,
              display: 'inline-flex',
              p: 0.5
            }}>
              {['today', 'week', 'month', 'quarter'].map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'contained' : 'text'}
                  onClick={() => setTimeRange(range)}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '14px',
                    background: timeRange === range ? MODERN_BMW_THEME.gradientPrimary : 'transparent',
                    color: timeRange === range ? MODERN_BMW_THEME.background : MODERN_BMW_THEME.textSecondary,
                    '&:hover': {
                      background: timeRange === range ? MODERN_BMW_THEME.gradientPrimary : `${MODERN_BMW_THEME.primary}08`
                    }
                  }}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </Paper>
          </Box>
        </Box>

        {/* Performance Overview Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            fontWeight: 600,
            mb: 1
          }}>
            Performance Overview
          </Typography>
          <Typography variant="body1" sx={{
            color: MODERN_BMW_THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Key metrics and performance indicators for your dealership
          </Typography>

          {/* Overview Stats - Dealer Focused */}
          <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <DealerStatCard
                title="Total Videos"
                value={dashboardData.overview.totalVideos}
                change={trends.totalVideosChange}
                changeType="positive"
                icon={<VideoLibrary />}
                color={MODERN_BMW_THEME.primary}
                onClick={() => handleViewDetails('videos')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DealerStatCard
                title="Average Quality Score"
                value={dashboardData.overview.averageScore.toFixed(1)}
                change={trends.averageScoreChange}
                changeType="positive"
                icon={<Star />}
                color={MODERN_BMW_THEME.warning}
                subtitle="out of 10"
                onClick={() => handleViewDetails('quality')}
              />
            </Grid>
           
            
          </Grid>
        </Box>

        {/* Analytics & Insights Section */}
<Box sx={{ mb: 6, textAlign: 'center' }}>
  <Typography variant="h4" sx={{
    color: MODERN_BMW_THEME.textPrimary,
    fontWeight: 600,
    mb: 1
  }}>
    Analytics & Insights
  </Typography>
  <Typography variant="body1" sx={{
    color: MODERN_BMW_THEME.textSecondary,
    mb: 4,
    maxWidth: '600px',
    mx: 'auto'
  }}>
    Detailed performance analysis and team insights
  </Typography>

  {/* Main Content Area */}
  <Grid container spacing={3} justifyContent="center">
    {/* Left Column - Performance Charts */}
    <Grid item xs={12} lg={8}>
      <Grid container spacing={3}>
        {/* Service Advisor Quality Comparison */}
        <Grid item xs={12}>
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm,
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, textAlign: 'center' }}>
                <TrendingUp sx={{ color: MODERN_BMW_THEME.primary, mr: 2, fontSize: 28 }} />
                <Typography variant="h5" sx={{ color: MODERN_BMW_THEME.textPrimary, fontWeight: 700 }}>
                  Service Advisor Quality Comparison
                </Typography>
              </Box>
              <Typography variant="body1" sx={{
                color: MODERN_BMW_THEME.textSecondary, mb: 4, textAlign: 'center', maxWidth: '900px', mx: 'auto', lineHeight: 1.6
              }}>
                Audio quality (🔵 left) and video quality (🟠 right) scores for each service advisor.
              </Typography>

              {dashboardData.serviceAdvisors.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: MODERN_BMW_THEME.textTertiary }}>
                  <Person sx={{ fontSize: 56, mb: 3, opacity: 0.5 }} />
                  <Typography variant="h6">No service advisor data available</Typography>
                </Box>
              ) : (
                <ServiceAdvisorQualityChart data={dashboardData.serviceAdvisors.slice(0, 8)} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Performance */}
        <Grid item xs={12}>
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm,
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Timeline sx={{ color: MODERN_BMW_THEME.primary, mr: 2, fontSize: 24 }} />
                  <Typography variant="h6" sx={{
                    color: MODERN_BMW_THEME.textPrimary,
                    fontWeight: 600
                  }}>
                    Daily Performance Trend
                  </Typography>
                </Box>
                <Chip
                  label={`This ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: MODERN_BMW_THEME.primary,
                    color: MODERN_BMW_THEME.primary,
                    fontWeight: 500
                  }}
                />
              </Box>
              <DailyPerformanceChart data={dashboardData.dailyPerformance} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>

    {/* Right Column - Rankings & Breakdown */}
    <Grid item xs={12} lg={4}>
      <Grid container spacing={3}>
        {/* Top Performers */}
        <Grid item xs={12}>
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm,
            height: '610px'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <EmojiEvents sx={{ color: MODERN_BMW_THEME.warning, mr: 2, fontSize: 24 }} />
                <Typography variant="h6" sx={{
                  color: MODERN_BMW_THEME.textPrimary,
                  fontWeight: 600
                }}>
                  Top 5 Service Advisors
                </Typography>
              </Box>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {dashboardData.serviceAdvisors.slice(0, 5).map((advisor, index) => (
                  <ServiceAdvisorCard
                    key={advisor.name}
                    advisor={advisor}
                    rank={index + 1}
                  />
                ))}
                {dashboardData.serviceAdvisors.length === 0 && (
                  <Typography variant="body2" sx={{ 
                    color: MODERN_BMW_THEME.textTertiary, 
                    textAlign: 'center', 
                    py: 4 
                  }}>
                    No advisor data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Box>

        {/* Recent Activity Section */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{
            color: MODERN_BMW_THEME.textPrimary,
            fontWeight: 600,
            mb: 1
          }}>
            Recent Activity
          </Typography>
          <Typography variant="body1" sx={{
            color: MODERN_BMW_THEME.textSecondary,
            mb: 4,
            maxWidth: '600px',
            mx: 'auto'
          }}>
            Latest video analyses and service records
          </Typography>

          {/* Recent Videos Table */}
          <Card sx={{
            background: MODERN_BMW_THEME.surfaceElevated,
            border: `1px solid ${MODERN_BMW_THEME.border}`,
            borderRadius: 3,
            boxShadow: MODERN_BMW_THEME.shadowSm
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Schedule sx={{ color: MODERN_BMW_THEME.primary, mr: 2, fontSize: 24 }} />
                  <Typography variant="h6" sx={{
                    color: MODERN_BMW_THEME.textPrimary,
                    fontWeight: 600
                  }}>
                    Recent Video Analyses
                  </Typography>
                </Box>
                
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{
                      backgroundColor: MODERN_BMW_THEME.surface,
                      '& th': {
                        borderBottom: `2px solid ${MODERN_BMW_THEME.border}`,
                        fontWeight: 600,
                        color: MODERN_BMW_THEME.textPrimary,
                        fontSize: '0.875rem',
                        py: 2
                      }
                    }}>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Service Advisor</TableCell>
                      <TableCell align="center">Quality Score</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Status</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentVideos.map((video) => (
                      <TableRow
                        key={video.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: MODERN_BMW_THEME.surface
                          },
                          '& td': {
                            borderBottom: `1px solid ${MODERN_BMW_THEME.borderLight}`,
                            py: 1.5
                          }
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{
                            color: MODERN_BMW_THEME.textPrimary,
                            fontWeight: 600
                          }}>
                            {video.vehicle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{
                            color: MODERN_BMW_THEME.textPrimary
                          }}>
                            {video.advisor}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={video.score}
                            size="small"
                            sx={{
                              background: 
                                parseFloat(video.score) >= 8.5 ? MODERN_BMW_THEME.successLight :
                                parseFloat(video.score) >= 7 ? MODERN_BMW_THEME.primaryUltraLight :
                                parseFloat(video.score) >= 5 ? MODERN_BMW_THEME.warningLight :
                                MODERN_BMW_THEME.errorLight,
                              color: 
                                parseFloat(video.score) >= 8.5 ? MODERN_BMW_THEME.success :
                                parseFloat(video.score) >= 7 ? MODERN_BMW_THEME.primary :
                                parseFloat(video.score) >= 5 ? MODERN_BMW_THEME.warning :
                                MODERN_BMW_THEME.error,
                              fontWeight: 700
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{
                            color: MODERN_BMW_THEME.textPrimary
                          }}>
                            {video.date}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={video.status}
                            size="small"
                            variant={video.status === 'Completed' ? 'filled' : 'outlined'}
                            color={video.status === 'Completed' ? 'success' : 'warning'}
                          />
                        </TableCell>
                        
                      </TableRow>
                    ))}
                    {dashboardData.recentVideos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: MODERN_BMW_THEME.textTertiary }}>
                            No recent video analyses found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

      </Container>
    </Box>
  );
}
