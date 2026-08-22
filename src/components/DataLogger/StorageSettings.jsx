import React from 'react';
import { Card, Input } from '../ui';

const StorageSettings = ({
    formData,
    handleInputChange,
    hours,
    minutes,
    seconds,
    onTimeChange,
    setHours,
    setMinutes,
    setSeconds,
    errors
}) => {
    return (
        <Card title="DATA COLLECTOR CONFIGURATION" subtitle="Configure sample intervals and database storage limits">
            <div className="space-y-6">
                <Input
                    label="DATA COLLECTOR NAME"
                    id="dataCollectorName"
                    name="dataCollectorName"
                    placeholder="ENTER NAME"
                    value={formData.dataCollectorName}
                    onChange={handleInputChange}
                    error={errors.dataCollectorName}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="SCAN RATE (ms)"
                        type="number"
                        id="scanRate"
                        name="scanRate"
                        value={formData.scanRate}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="DATA STORAGE COUNT"
                        type="number"
                        id="dataStorageCount"
                        name="dataStorageCount"
                        value={formData.dataStorageCount}
                        onChange={handleInputChange}
                        error={errors.dataStorageCount}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-industrial-500 uppercase tracking-wider mb-2">
                        DATA STG RATE (HRS)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <Input
                            type="number"
                            placeholder="Hours"
                            value={hours}
                            onChange={(e) => onTimeChange(setHours, e.target.value)}
                            className="text-center"
                        />
                        <Input
                            type="number"
                            placeholder="Minutes"
                            value={minutes}
                            onChange={(e) => onTimeChange(setMinutes, e.target.value)}
                            className="text-center"
                        />
                        <Input
                            type="number"
                            placeholder="Seconds"
                            value={seconds}
                            onChange={(e) => onTimeChange(setSeconds, e.target.value)}
                            className="text-center"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StorageSettings;
