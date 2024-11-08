"use client"
import React, { useCallback, useRef } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toPng } from 'html-to-image';


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart"

// Define the structure of each data entry
type DataEntry = {
    [key: string]: string | number; // Generalized to allow any key with string or number values
};

// Define a type for the config object
type ChartConfig = {
    [key: string]: {
        label: string;
        color: string;
    };
};

// Define the props for the Graph component
interface GraphProps {
    data: DataEntry[]; // Required data array
    title: string;
    subtitle: string;
    xAxisKey: keyof DataEntry; // Required x-axis key
    yAxisKeys: (keyof DataEntry)[]; // Required y-axis keys
    yAxisLabel?: string; // Optional Y-axis label
}

export function Graph({ data, title, subtitle, xAxisKey, yAxisKeys, yAxisLabel }: GraphProps) {
    const captureRef = useRef<HTMLDivElement>(null);

    const handleCapture = useCallback(() => {
        if (captureRef.current === null) {
            return;
        }
    
        // Apply background color
        captureRef.current.style.backgroundColor = 'white';
    
        toPng(captureRef.current, { cacheBust: true })
            .then((dataUrl) => {
                // Remove background color after capturing
                if (captureRef.current) {
                    captureRef.current.style.backgroundColor = '';
                }
    
                const link = document.createElement('a');
                link.download = 'capture.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                // Remove background color in case of error
                if (captureRef.current) {
                    captureRef.current.style.backgroundColor = '';
                }
                console.error('Error capturing image:', error);
            });
    }, [captureRef]);

    // Create a default config object based on yAxisKeys with explicit typing
    const defaultConfig: ChartConfig = yAxisKeys.reduce((acc, key, index) => {
        acc[key as string] = {
            label: key as string,
            color: `hsl(var(--chart-${index + 1}))`
        }
        return acc
    }, {} as ChartConfig);

    // Calculate the maximum Y-axis value across all yAxisKeys in the data
    const maxYAxisValue = Math.max(
        0,
        ...data.flatMap(entry => 
            yAxisKeys.map(key => {
                const value = entry[key];
                const numericValue = typeof value === "number" ? value : parseFloat(value as string);
                const finalValue = !isNaN(numericValue) ? numericValue : 0;
                return Math.floor(finalValue * 1.1);
            })
        )
    );

    return (
        <Card className="mt-4">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{title}</CardTitle>
                    <Badge
                        variant="secondary"
                        className="m-1 flex justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-110 rounded-full p-2"
                        onClick={handleCapture}
                    >
                        <Download 
                            className="cursor-pointer" 
                            size={26}
                        />
                    </Badge>
                </div>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={defaultConfig}>
                    <LineChart
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xAxisKey as string}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis 
                            domain={[0, maxYAxisValue]} // Set Y-axis range from 0 to max value
                            label={{
                                value: yAxisLabel || "Count",
                                angle: -90,
                                position: "insideLeft",
                                offset: 0,
                                style: { textAnchor: 'middle', fontSize: '12px', fill: '#666' },
                            }}
                        />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        {yAxisKeys.map((key, index) => (
                            <Line
                                key={key as string}
                                dataKey={key as string}
                                type="natural"
                                name={key as string} // Use the key as the label
                                stroke={`hsl(var(--chart-${index + 1}))`}
                                dot={false}
                                strokeWidth={2}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Powered by OpenAI
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {data[0][xAxisKey]} - {data[data.length - 1][xAxisKey]}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default Graph
