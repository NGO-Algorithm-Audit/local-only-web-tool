import ErrorBoundary from '../ErrorBoundary';
import DistributionBarChart from '../graphs/DistributionBarChart';
import { MarkdownWithTooltips } from '../MarkdownWithTooltips';
import FilterSelect from '../ui/FilterSelect';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export interface UnivariateDistributionSyntheticDataAccordeonContentProps {
    syntheticData: Record<string, number>[];
    realData: Record<string, number>[];
    dataTypes: Record<string, string>;
}

export const UnivariateDistributionSyntheticDataAccordeonContent = ({
    syntheticData,
    realData,
    dataTypes,
}: UnivariateDistributionSyntheticDataAccordeonContentProps) => {
    const [categorieFilter, setCategorieFilter] = useState<string | null>();
    const { t } = useTranslation();

    useEffect(() => {
        const categories = Object.keys(realData[0]).map(
            (columnName: string) => {
                return columnName;
            }
        );
        setCategorieFilter(categories[0] || null);
    }, [syntheticData, realData, dataTypes]);
    const categories = Object.keys(realData[0]).map((columnName: string) => {
        return columnName;
    });
    if (categories.length === 0) {
        return null;
    }
    return (
        <div className="flex flex-col justify-start items-start gap-4 px-1 py-4 w-100">
            <MarkdownWithTooltips className="py-4 markdown">
                {t('syntheticData.univariateText', {
                    samples: syntheticData.length,
                })}
            </MarkdownWithTooltips>
            <div className="hideonprint">
                <FilterSelect
                    filterValues={categories}
                    defaultValue={categories[0]}
                    onFilter={value => {
                        setCategorieFilter(value);
                    }}
                    labelKey="syntheticData.univariateTextFilterSelect"
                />
            </div>

            {Object.keys(realData[0]).map(
                (columnName: string, columnIndex: number) => {
                    const realDataColumn = realData.map(
                        (row: Record<string, number>) => row[columnName]
                    );
                    const syntheticDataColumn = syntheticData.map(
                        (row: Record<string, number>) => row[columnName]
                    );
                    if (columnName === categorieFilter) {
                        return (
                            <ErrorBoundary key={columnIndex}>
                                <DistributionBarChart
                                    dataType={dataTypes[columnName]}
                                    realData={realDataColumn}
                                    syntheticData={syntheticDataColumn}
                                    column={columnName}
                                />
                            </ErrorBoundary>
                        );
                    }
                    return (
                        <ErrorBoundary key={columnIndex}>
                            <div className="hidden showonprint overflow-x-hidden">
                                <DistributionBarChart
                                    dataType={dataTypes[columnName]}
                                    realData={realDataColumn}
                                    syntheticData={syntheticDataColumn}
                                    column={columnName}
                                />
                            </div>
                        </ErrorBoundary>
                    );
                }
            )}
        </div>
    );
};
