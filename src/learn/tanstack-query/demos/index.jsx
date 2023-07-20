import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { apis } from "../apis";

// 1: build client
const theQueryClient = new QueryClient();

function Kid() {
  const [it, setIt] = useState(0);

  // 3: use querys
  const query = useQuery({
    queryKey: ["books"],
    queryFn: apis.getBooks,
  });
  // 4: use client
  const theClient = useQueryClient();

  // 5: use mutation
  const mutation = useMutation({
    mutationFn: apis.addBook,
    onSuccess() {
      theClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
  });

  console.log({ query });

  return (
    <>
      <div>
        {query.isLoading || query.isFetching
          ? "loading..."
          : "done loading: " + query.data.join(", ")}
      </div>
      <button
        onClick={() => {
          setIt((old) => old + 1);
          mutation.mutate(Date.now());
        }}
      >
        test {it}
      </button>
    </>
  );
}

function Config() {
  const client = useQueryClient();
  client.setDefaultOptions({
    queries: {
      // how long the cache data become stale, default to immediatelly
      staleTime: 5 * 1000,
      // refetch setting
      // default to true
      refetchOnWindowFocus: true,
      // default to true
      refetchOnMount: true,
      // default to false
      refetchInterval: false,
      // default to true
      refetchOnReconnect: true,
      // 'inactive' query result will be cache, default to 5 min
      cacheTime: 5 * 60 * 1000,
      // retry, default to 3 times, and exponential back off
      retry: 3,
      // 'retryDelay': '<exponential back off>'
      // structuralSharing for query result comparing, default to true
      structuralSharing: true,
      // a function for detect equality
      // isDataEqual: null
      /**
       * how query behave when offline (no network)
       *    online: default, when offline, loading can be paused, and no reties, restore after reconnecting
       *    always: always fetch and retries for offline or online, refetchOnReconnect default to false
       *    offlineFirst: between above two, fetch once even offline
       * can be mocked by its devtools
       */
      networkMode: "online",
    },
  });
  const { data } = useQuery({ queryKey: ["books"], queryFn: apis.getBooks });
  return <>{data ? data.join(", ") : "loading"}</>;
}

function Query() {
  /**
   * key is required and important
   *  must be an array
   *  can be complex as array of string or object
   *  serializable and unique to the query data
   *  !!! Query Keys are hashed deterministically
   *  object key order not matter, following are equal
   *      {name, age}, {age, name}, {name, age, gender: undefined}
   *  array item order matters, following are not equal
   *      [1,2], [2,1]
   *  there are npm packages for this
   */
  const queryKey = ["books"];

  /**
   * required to fetch data
   *    a function return a promise: resolve data or throw (reject) error (for reporting error)
   *    get argument 'context'
   *        queryKey
   *        signal: use for cancellation
   *        meta: custom data
   *        pageParam: infinite query only, with page param
   */
  const queryFn = ({ queryKey, signal, meta, pageParam }) => {
    // less than 18 will cause error
    return apis.getAdultBooks(20);
  };

  const {
    /**
     * status:
     *  isLoading
     *  isError: check error
     *  isSuccess: get data
     */
    isLoading,
    isError,
    error,
    data,
    /**
     * can be: fetching, idle, paused.
     * all combinations with status is possible
     *  status for 'data'
     *  fetchStatus for 'is queryFn running?'
     */
    fetchStatus,
  } = useQuery({
    queryKey,
    queryFn,
  });

  if (fetchStatus === "fetching") {
    return <div>Fetching...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something goes wrong</div>;
  }

  // must be success, can use the 'data'
  return <div>Got books: {data.join(",")} </div>;
}

function ParallelQuery() {
  // manual, not for suspense mode (useQueries)
  // useQuery(...)
  // useQuery(...)
  // ...

  // dynamic
  const [normal, adult] = useQueries({
    queries: [
      {
        queryKey: ["normal"],
        queryFn: apis.getBooks,
      },
      {
        queryKey: ["adult"],
        queryFn: apis.getAdultBooks,
      },
    ],
  });

  return (
    <>
      <p>result: </p>
      <pre>{JSON.stringify({ normal, adult }, null, 2)}</pre>
    </>
  );
}

function EnableQuery() {
  let [ready, setReady] = useState(false);
  setTimeout(() => {
    setReady(true);
  }, 3000);

  const { data, status, fetchStatus } = useQuery({
    queryKey: ["books"],
    queryFn: apis.getAdultBooks,
    // used for dependent query
    enabled: ready,
  });

  return (
    <>
      <pre>state: {JSON.stringify({ status, fetchStatus })}</pre>
      <div>{ready ? data + "" : "not ready..."}</div>
    </>
  );
}

function GlobalFetchingIndicator() {
  const fetching = useIsFetching();
  return <div>{fetching ? "fetching..." : "idle"}</div>;
}

export default function Demo() {
  return (
    // 2: provide the client
    <QueryClientProvider client={theQueryClient}>
      <GlobalFetchingIndicator />
      {/* 3: use query in children */}
      <EnableQuery />
    </QueryClientProvider>
  );
}
