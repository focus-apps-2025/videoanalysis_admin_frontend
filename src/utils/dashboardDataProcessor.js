// src/utils/dashboardDataProcessor.js

// Filter results by time range
export const filterByTimeRange = (results, timeRange) => {
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
    const resultDate = new Date(result.created_at || result.date);
    return resultDate >= startDate && resultDate <= now;
  });
};

// Calculate overview statistics
export const calculateOverview = (filteredResults) => {
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
    averageScore: Math.round(averageScore * 10) / 10, // 1 decimal place
    serviceAdvisors,
    completionRate,
    lowQualityVideos
  };
};

// Calculate service advisor performance
export const calculateAdvisorPerformance = (filteredResults) => {
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
      overall: Math.round(avgScore * 10) / 10
    };
  }).sort((a, b) => b.score - a.score);
};

// Calculate quality breakdown
export const calculateQualityBreakdown = (filteredResults) => {
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

// Calculate daily performance
export const calculateDailyPerformance = (filteredResults, timeRange) => {
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
    const resultDate = new Date(result.created_at || result.date);
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
export const processDashboardData = (allResults, timeRange) => {
  const filteredResults = filterByTimeRange(allResults, timeRange);
  
  return {
    overview: calculateOverview(filteredResults),
    serviceAdvisors: calculateAdvisorPerformance(filteredResults),
    qualityBreakdown: calculateQualityBreakdown(filteredResults),
    dailyPerformance: calculateDailyPerformance(filteredResults, timeRange),
    recentVideos: allResults.slice(0, 8), // Most recent 8 analyses
    performanceTrend: calculateDailyPerformance(filteredResults, timeRange)
  };
};