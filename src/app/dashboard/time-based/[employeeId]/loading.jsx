export default function EmployeeSkeleton() {
    return (
        <div className="w-full space-y-6 animate-pulse p-2">

            {/* Employee Card Skeleton */}
            <div className="w-full mx-auto bg-gradient-to-br from-secondary to-primary text-white shadow-2xl rounded-2xl p-6 border border-border">
                <div className="text-center mb-4">
                    <div className="h-6 w-32 bg-background rounded mx-auto mb-1" />
                    <div className="h-4 w-24 bg-background rounded mx-auto" />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-background rounded-full" />
                        <div className="h-4 w-40 bg-background rounded" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-background rounded-full" />
                        <div className="h-4 w-32 bg-background rounded" />
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-background rounded-full" />
                        <div className="h-4 w-44 bg-background rounded" />
                    </div>
                </div>

            </div>

            {/* Calendar Skeleton */}
            <div className="w-full bg-surface rounded-2xl p-4 shadow border border-border grid grid-cols-7 gap-2">
                {/* Weekday Headers */}
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="h-4 w-6 bg-background rounded mx-auto" />
                ))}

                {/* Calendar Days Skeleton */}
                {Array.from({ length: 35 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="h-8 w-8 bg-background rounded-full mx-auto"
                    />
                ))}
            </div>
        </div>
    );
};