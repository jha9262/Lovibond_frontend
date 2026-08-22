import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Tabs, 
    Tab, 
    Paper,
    Container
} from '@mui/material';
import { Settings as SettingsIcon, Cpu, Sliders, Factory } from 'lucide-react';
import Datalogger from './NewDataLogger';
import DeviceConfiguration from './DeviceConfiguration';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', pb: 8 }}>
            {/* Header Section */}
            <Box sx={{ 
                bgcolor: '#fff', 
                borderBottom: '1px solid #e5e7eb', 
                pt: 4, 
                pb: 0,
                mb: 4
            }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Box sx={{ p: 1, bgcolor: 'rgba(249, 115, 22, 0.1)', borderRadius: 1.5 }}>
                            <SettingsIcon size={24} color="#f97316" />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'black', color: '#111827', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                System Settings
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 'medium' }}>
                                Configure data acquisition hardware and connected devices
                            </Typography>
                        </Box>
                    </Box>

                    <Tabs 
                        value={activeTab} 
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#f97316',
                                height: 3,
                                borderRadius: '3px 3px 0 0'
                            },
                            '& .MuiTab-root': {
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                color: '#6b7280',
                                minHeight: 48,
                                transition: 'all 0.2s',
                                '&.Mui-selected': {
                                    color: '#f97316',
                                }
                            }
                        }}
                    >
                        <Tab 
                            icon={<Sliders size={18} style={{ marginBottom: 4 }} />} 
                            iconPosition="start" 
                            label="DCN CONFIGURATION" 
                        />
                        <Tab 
                            icon={<Cpu size={18} style={{ marginBottom: 4 }} />} 
                            iconPosition="start" 
                            label="DCN DEVICES" 
                        />
                    </Tabs>
                </Container>
            </Box>

            {/* Content Section */}
            <Container maxWidth="xl">
                <Box sx={{ animate: 'fade-in 0.3s ease-out' }}>
                    {activeTab === 0 && <Datalogger isEmbedded={true} />}
                    {activeTab === 1 && <DeviceConfiguration isEmbedded={true} />}
                </Box>
            </Container>
        </Box>
    );
};

export default SettingsPage;
