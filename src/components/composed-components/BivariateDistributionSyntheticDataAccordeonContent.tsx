import GroupBarChart from '../graphs/GroupBarChart';
import ViolinChart from '../graphs/ViolinChart';
import { MarkdownWithTooltips } from '../MarkdownWithTooltips';
import { DataRow } from '@/interfaces/datarow';
import { useTranslation } from 'react-i18next';
import FilterSelect from '../ui/FilterSelect';
import { useEffect, useState } from 'react';

function countCategory2ForCategory1(
    data: DataRow[],
    category1: string,
    category2: string,
    column1: string,
    column2: string
) {
    const count = data.filter(
        row => row[column1] === category1 && row[column2] === category2
    ).length;

    const total = data.filter(row => row[column1] === category1).length;
    if (total === 0) {
        return 0;
    }
    return (count / total) * 100;
}

export interface BivariateDistributionSyntheticDataAccordeonContentProps {
    syntheticData: any;
    realData: any;
    dataTypes: Record<string, string>;
    columnNames: string[];
}

export const BivariateDistributionSyntheticDataAccordeonContent = ({
    syntheticData,
    realData,
    dataTypes,
    columnNames = [],
}: BivariateDistributionSyntheticDataAccordeonContentProps) => {
    const { t } = useTranslation();
    const [columnFilter1, setColumnFilter1] = useState<{
        value: string;
        index: number;
    } | null>(null);
    const [columnFilter2, setColumnFilter2] = useState<{
        value: string;
        index: number;
    } | null>(null);

    useEffect(() => {
        if (columnNames.length > 1) {
            setColumnFilter1({
                value: columnNames[0],
                index: 0,
            });
            setColumnFilter2({
                value: columnNames[1],
                index: 1,
            });
        }
    }, [columnNames, syntheticData, realData, dataTypes]);

    function getSelectedChart() {
        if (!columnFilter1 || !columnFilter2) {
            return null;
        }
        const dataType = dataTypes[columnFilter1.value];
        const dataType2 = dataTypes[columnFilter2.value];

        const column = columnFilter1.value;
        const column2 = columnFilter2.value;
        if (dataType === 'categorical' && dataType2 === 'numerical') {
            return (
                <ViolinChart
                    key={column + column2}
                    categoricalColumn={column}
                    numericColumn={column2}
                    realData={realData}
                    syntheticData={syntheticData}
                    comparison={true}
                />
            );
        } else if (dataType === 'numerical' && dataType2 === 'categorical') {
            return (
                <ViolinChart
                    key={column + column2}
                    categoricalColumn={column2}
                    numericColumn={column}
                    realData={realData}
                    syntheticData={syntheticData}
                    comparison={true}
                />
            );
        } else if (dataType === 'categorical' && dataType2 === 'categorical') {
            const categories = Array.from(
                new Set([...realData.map((d: DataRow) => d[column] as string)])
            );
            const categories2 = Array.from(
                new Set([...realData.map((d: DataRow) => d[column2] as string)])
            );

            return (
                <div key={column + column2}>
                    <h2 className="text-center font-bold mt-2 text-[12px]">
                        {column} vs {column2}
                    </h2>
                    <div className="flex flex-row w-full overflow-auto gap-4">
                        {categories.map((item, index) => (
                            <div
                                key={`${item}${index}`}
                                className="flex flex-col"
                            >
                                <GroupBarChart
                                    showMeanLine={false}
                                    colorRange={['steelblue', 'orange']}
                                    yAxisLabel={t('distribution.percentage')}
                                    title={`${column} = ${item}`}
                                    data={categories2.map(item2 => ({
                                        // count : number of times where item2 appears in the data for category2 and rows where category1 = item
                                        name: `${item2}`,
                                        values: [
                                            {
                                                name: t(
                                                    'distribution.realData'
                                                ),
                                                value: countCategory2ForCategory1(
                                                    realData,
                                                    item,
                                                    item2,
                                                    column,
                                                    column2
                                                ),
                                            },
                                            {
                                                name: t(
                                                    'distribution.syntheticData'
                                                ),
                                                value: countCategory2ForCategory1(
                                                    syntheticData,
                                                    item,
                                                    item2,
                                                    column,
                                                    column2
                                                ),
                                            },
                                        ],
                                    }))}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    const charts = columnNames.map((column, indexcolumn1) => {
        const dataType = dataTypes[column];
        return columnNames.map((column2, indexcolumn2) => {
            const dataType2 = dataTypes[column2];
            if (indexcolumn1 >= indexcolumn2) {
                return null;
            }

            if (dataType === 'categorical' && dataType2 === 'numerical') {
                return (
                    <ViolinChart
                        key={column + column2}
                        categoricalColumn={column}
                        numericColumn={column2}
                        realData={realData}
                        syntheticData={syntheticData}
                        comparison={true}
                    />
                );
            } else if (
                dataType === 'numerical' &&
                dataType2 === 'categorical'
            ) {
                return (
                    <ViolinChart
                        key={column + column2}
                        categoricalColumn={column2}
                        numericColumn={column}
                        realData={realData}
                        syntheticData={syntheticData}
                        comparison={true}
                    />
                );
            } else if (
                dataType === 'categorical' &&
                dataType2 === 'categorical'
            ) {
                const categories = Array.from(
                    new Set([
                        ...realData.map((d: DataRow) => d[column] as string),
                    ])
                );
                const categories2 = Array.from(
                    new Set([
                        ...realData.map((d: DataRow) => d[column2] as string),
                    ])
                );

                return (
                    <div key={column + column2}>
                        <h2 className="text-center font-bold mt-2 text-[12px]">
                            {column} vs {column2}
                        </h2>
                        <div className="flex flex-row w-full overflow-auto gap-4">
                            {categories.map((item, index) => (
                                <div
                                    key={`${item}${index}`}
                                    className="flex flex-col"
                                >
                                    <GroupBarChart
                                        showMeanLine={false}
                                        colorRange={['steelblue', 'orange']}
                                        yAxisLabel={t(
                                            'distribution.percentage'
                                        )}
                                        title={`${column} = ${item}`}
                                        data={categories2.map(item2 => ({
                                            // count : number of times where item2 appears in the data for category2 and rows where category1 = item
                                            name: `${item2}`,
                                            values: [
                                                {
                                                    name: t(
                                                        'distribution.realData'
                                                    ),
                                                    value: countCategory2ForCategory1(
                                                        realData,
                                                        item,
                                                        item2,
                                                        column,
                                                        column2
                                                    ),
                                                },
                                                {
                                                    name: t(
                                                        'distribution.syntheticData'
                                                    ),
                                                    value: countCategory2ForCategory1(
                                                        syntheticData,
                                                        item,
                                                        item2,
                                                        column,
                                                        column2
                                                    ),
                                                },
                                            ],
                                        }))}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
            return null;
        });
    });
    if (columnNames.length < 2) {
        return null;
    }
    const columnNames1 = columnNames.filter(
        name => name !== columnFilter2?.value
    );
    const columnNames2 = columnNames.filter(
        name => name !== (columnFilter1?.value ?? columnNames[0])
    );
    return (
        <div className="pt-[20px]  px-1">
            <MarkdownWithTooltips className="py-4 markdown">
                {t('syntheticData.bivariateText', {
                    samples: syntheticData.length,
                })}
            </MarkdownWithTooltips>

            <div className="hideonprint">
                <FilterSelect
                    filterValues={columnNames1}
                    defaultValue={columnNames1[0]}
                    onFilter={value => {
                        setColumnFilter1({
                            value,
                            index: columnNames.indexOf(value),
                        });
                    }}
                    labelKey="syntheticData.bivariateTextFilterSelect1"
                />
                <FilterSelect
                    filterValues={columnNames2}
                    defaultValue={columnNames2[0]}
                    onFilter={value => {
                        setColumnFilter2({
                            value,
                            index: columnNames2.indexOf(value),
                        });
                    }}
                    labelKey="syntheticData.bivariateTextFilterSelect2"
                />
                {getSelectedChart()}
            </div>
            <div className="hidden showonprint overflow-x-hidden">{charts}</div>
        </div>
    );
};
