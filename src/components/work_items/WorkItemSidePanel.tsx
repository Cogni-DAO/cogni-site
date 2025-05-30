'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkItemRenderer } from '@/components/blocks/WorkItemRenderer';
import { narrowWorkItemMeta } from '@/utils/workItemUtils';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { useBlock } from '@/hooks/useBlock';
import Link from 'next/link';

// Custom SheetContent without the automatic close button
interface CustomSheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
    side?: "top" | "right" | "bottom" | "left";
    width?: string;
    onResize?: (newWidth: number) => void;
}

const CustomSheetContent = React.forwardRef<
    HTMLDivElement,
    CustomSheetContentProps
>(({ side = "right", className, children, width = '500px', style, ...props }, ref) => {
    // Define our own variants without the width constraints
    const sheetVariants = {
        right: "inset-y-0 right-0 h-full border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        left: "inset-y-0 left-0 h-full border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    };

    // Combine passed width with any other style props
    const combinedStyle = {
        width,
        maxWidth: '90vw',
        ...style
    };

    return (
        <SheetPrimitive.Portal>
            <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <SheetPrimitive.Content
                ref={ref as React.RefObject<HTMLDivElement>}
                className={cn(
                    "fixed z-50 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 p-0",
                    sheetVariants[side],
                    className
                )}
                style={combinedStyle}
                {...props}
            >
                {children}
            </SheetPrimitive.Content>
        </SheetPrimitive.Portal>
    );
});
CustomSheetContent.displayName = "CustomSheetContent";

// Custom resize handle component
function ResizeHandle({
    onResize,
    onResizeStart,
    onResizeEnd
}: {
    onResize: (newWidth: number) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
}) {
    const [isDragging, setIsDragging] = useState(false);

    // Handle mouse down to start dragging
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        onResizeStart?.();

        // Add event listeners for dragging
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // Handle mouse move while dragging
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        // Calculate new width based on mouse position (distance from right edge)
        const viewportWidth = window.innerWidth;
        const newWidth = viewportWidth - e.clientX;

        // Apply a min width to prevent panel from getting too small
        const minWidth = 300;
        if (newWidth >= minWidth) {
            onResize(newWidth);
        }
    };

    // Handle mouse up to stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
        onResizeEnd?.();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            className={cn(
                "absolute left-0 top-0 h-full w-2 cursor-ew-resize z-[99]",
                "after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-border",
                "hover:after:opacity-100 after:opacity-0 after:transition-opacity",
                isDragging ? "after:opacity-100" : ""
            )}
            onMouseDown={handleMouseDown}
        />
    );
}

interface WorkItemSidePanelProps {
    blockId: string | null;
    onClose: () => void;
}

export function WorkItemSidePanel({ blockId, onClose }: WorkItemSidePanelProps) {
    const { block, isLoading, isError } = useBlock(blockId || '');
    const { toast } = useToast();
    const [panelWidth, setPanelWidth] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Don't attempt to fetch if no blockId
    const isOpen = !!blockId;

    const itemTitle = block?.metadata ? (block.metadata.title as string) || 'Work Item Details' : 'Work Item Details';

    // Handle resize
    const handleResize = (newWidth: number) => {
        console.log('Resizing to width:', newWidth);
        setPanelWidth(newWidth);

        // Apply width directly to the DOM element for immediate feedback
        if (panelRef.current) {
            panelRef.current.style.width = `${newWidth}px`;
        }
    };

    // Reset width on close
    useEffect(() => {
        if (!isOpen) {
            setPanelWidth(500);
        }
    }, [isOpen]);

    // Handle errors
    useEffect(() => {
        if (isError && blockId) {
            toast({
                title: 'Error loading work item',
                description: 'There was a problem loading the selected work item.',
                variant: 'destructive',
            });
        }
    }, [isError, blockId, toast]);

    // Prevent scroll when resizing
    useEffect(() => {
        if (isResizing) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isResizing]);

    const renderContent = () => {
        if (!isOpen) {
            return null;
        }

        if (isLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            );
        }

        if (isError || !block) {
            return (
                <div className="p-4 text-center">
                    <p className="text-destructive mb-4">Failed to load work item</p>
                </div>
            );
        }

        const meta = narrowWorkItemMeta(block);
        if (!meta) {
            return (
                <div className="p-4 text-center">
                    <p className="text-amber-600 mb-4">This item is not a valid work item</p>
                </div>
            );
        }

        return (
            <div className="overflow-y-auto p-4">
                <WorkItemRenderer block={block} meta={meta} />
            </div>
        );
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
            <CustomSheetContent
                ref={panelRef}
                side="right"
                width={`${panelWidth}px`}
                className="p-0"
            >
                <ResizeHandle
                    onResize={handleResize}
                    onResizeStart={() => setIsResizing(true)}
                    onResizeEnd={() => setIsResizing(false)}
                />
                <div className="flex flex-col h-full">
                    <div className="p-6 flex flex-col h-full">
                        <SheetHeader className="mb-4">
                            <div className="flex items-center justify-between">
                                <SheetTitle>{isLoading ? 'Loading...' : itemTitle}</SheetTitle>
                                <div className="flex items-center space-x-2">
                                    {/* Fullscreen button (linking to the full page) */}
                                    {blockId && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                            className="h-8 w-8"
                                            title="View full page"
                                        >
                                            <Link href={`/blocks/${blockId}`}>
                                                <ExternalLink className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}

                                    {/* Custom close button */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClose}
                                        className="h-8 w-8"
                                        title="Close panel"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </SheetHeader>

                        {renderContent()}
                    </div>
                </div>
            </CustomSheetContent>
        </Sheet>
    );
} 