import useSWR from 'swr';
import {
    getLinksFromApiV1LinksFromBlockIdGet,
    getLinksToApiV1LinksToBlockIdGet
} from '@/data/v1-links';
import { fetchLinks } from '@/utils/links';
import type { GetLinksFromApiV1LinksFromBlockIdGetParams } from '@/data/models/getLinksFromApiV1LinksFromBlockIdGetParams';
import type { GetLinksToApiV1LinksToBlockIdGetParams } from '@/data/models/getLinksToApiV1LinksToBlockIdGetParams';
import type { BlockLink } from '@/data/models/blockLink';

/**
 * Hook for fetching all block links
 * @param branch - Optional branch name to fetch links from (defaults to 'main')
 * @param namespace - Optional namespace to filter links (defaults to 'legacy')
 */
export function useLinks(branch?: string, namespace?: string) {
    const key = [
        'links',
        ...(branch ? [branch] : []),
        ...(namespace ? [namespace] : [])
    ];
    const { data, error, isLoading, mutate } = useSWR(key, () => fetchLinks(branch, namespace));

    return {
        links: data as BlockLink[] | undefined,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook for fetching links from a specific block (outbound links)
 */
export function useLinksFrom(
    blockId: string,
    params?: GetLinksFromApiV1LinksFromBlockIdGetParams
) {
    const { data, error, isLoading, mutate } = useSWR(
        blockId ? ['links-from', blockId, params] : null,
        async () => {
            const response = await getLinksFromApiV1LinksFromBlockIdGet(blockId, params);
            return response.data;
        }
    );

    return {
        links: data as BlockLink[] | undefined,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook for fetching links to a specific block (inbound links)
 */
export function useLinksTo(
    blockId: string,
    params?: GetLinksToApiV1LinksToBlockIdGetParams
) {
    const { data, error, isLoading, mutate } = useSWR(
        blockId ? ['links-to', blockId, params] : null,
        async () => {
            const response = await getLinksToApiV1LinksToBlockIdGet(blockId, params);
            return response.data;
        }
    );

    return {
        links: data as BlockLink[] | undefined,
        isLoading,
        isError: error,
        mutate
    };
}

/**
 * Hook for fetching both inbound and outbound links for a block
 */
export function useBlockLinks(
    blockId: string,
    params?: {
        from?: GetLinksFromApiV1LinksFromBlockIdGetParams;
        to?: GetLinksToApiV1LinksToBlockIdGetParams;
    }
) {
    const linksFrom = useLinksFrom(blockId, params?.from);
    const linksTo = useLinksTo(blockId, params?.to);

    return {
        linksFrom: linksFrom.links,
        linksTo: linksTo.links,
        isLoading: linksFrom.isLoading || linksTo.isLoading,
        isError: linksFrom.isError || linksTo.isError,
        mutate: () => {
            linksFrom.mutate();
            linksTo.mutate();
        }
    };
} 