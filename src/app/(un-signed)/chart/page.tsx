import {Suspense} from 'react';
import {WeeklyMoodTrend} from "@/types/weekly-mood-trend"; 
import StackedBarChart from "@/components/chart/stacked-bar"; 
import {Box, CircularProgress, Container, Grid, Paper, Typography} from "@mui/material";
import StackedAreaChart from "@/components/chart/stacked-area";
import BarChart from "@/components/chart/bar";
import DonutChart from "@/components/chart/donut";
import MultiLineChart from "@/components/chart/multi-line";



async function getChartData() {
    const [data1Res, data2Res, data3Res] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mock/weekly-mood-trend`),
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mock/top-coffee-brands`),
        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/mock/coffee-consumption`),
    ]);

    const weeklyModTrendData: WeeklyMoodTrend[] = await data1Res.json();
    const topCoffeBrandsData = await data2Res.json();
    const coffeConsumptionData = await data3Res.json();

    return { weeklyModTrendData, topCoffeBrandsData, coffeConsumptionData };
}


export default async function ChartPage() {

    const { weeklyModTrendData,topCoffeBrandsData ,coffeConsumptionData} = await getChartData();

    return (

        <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    mb: 5,
                    color: '#1976d2'
                }}
            >
                📊 차트 대시보드
            </Typography>
            
            <Box mb={6}>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ mb: 3, pb: 1, borderBottom: '2px solid #e0e0e0', fontWeight: 600 }}
                >
                    주간 무드 트렌드
                </Typography>

                <Grid container spacing={4}>
                    
                    <Grid  size={6}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height={300}><CircularProgress/></Box>}>
                                <StackedBarChart data={weeklyModTrendData}/>
                            </Suspense>
                        </Paper>
                    </Grid>
                    <Grid  size={6}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height={300}><CircularProgress/></Box>}>
                                <StackedAreaChart data={weeklyModTrendData}/>
                            </Suspense>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            
            <Box mb={6}>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ mb: 3, pb: 1, borderBottom: '2px solid #e0e0e0', fontWeight: 600 }}
                >
                    인기 커피 브랜드 분포
                </Typography>

                <Grid container spacing={4}>
                    <Grid size={6}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height={300}><CircularProgress/></Box>}>
                                <BarChart data={topCoffeBrandsData}/>
                            </Suspense>
                        </Paper>
                    </Grid>
                    <Grid size={6}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height={300}><CircularProgress/></Box>}>
                                <DonutChart data={topCoffeBrandsData}/>
                            </Suspense>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            
            <Box mb={6}>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ mb: 3, pb: 1, borderBottom: '2px solid #e0e0e0', fontWeight: 600 }}
                >
                    팀별 커피 소비/버그/생산성
                </Typography>

                <Grid container spacing={4}>
                    
                    <Grid size={12}>
                        <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                            <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height={300}><CircularProgress/></Box>}>
                                <MultiLineChart data={coffeConsumptionData}/>
                            </Suspense>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
