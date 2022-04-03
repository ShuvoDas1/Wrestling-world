import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import Head from "next/head";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import GRAPHQL_QUERIES from "../services/GraphQLQueries";
import { useCallback } from "react";
import { RiSearchLine } from "react-icons/ri";
import dynamic from 'next/dynamic';

const ResultList = dynamic(()=> import("../components/results/ResultList"))

function Search() {
  const router = useRouter();

  const [query, setQuery] = useState<string>((router.query?.q || "") as string);

  const dbQuery = useCallback(
    (offset: number) => {
      return GRAPHQL_QUERIES.SEARCH_POSTS(query, offset);
    },
    [query]
  );

  const handleUserSearch = useCallback(
    (e: FormEvent, value: string) => {
      e.preventDefault();
      if (query !== value) {
        setQuery(value);
      }
    },
    [query]
  );

  return (
    <>
      <Head>
        <title>{query} Results | WrestlingWorld</title>
      </Head>
      <Navbar />
      <div className="max-w-[1240px] mx-auto h-full">
        <SearchInput query={query} handleUserSearch={handleUserSearch} />
        <ResultList query={dbQuery} emptyResultsLabel="No posts to display" />
      </div>

      <Footer />
    </>
  );
}

interface SearchInputProps {
  query: string;
  handleUserSearch: (e: FormEvent, value: string) => void;
}

const SearchInput = ({ query, handleUserSearch }: SearchInputProps) => {
  const [userSearchInput, setUserSearchInput] = useState<string>(query);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      handleUserSearch(e, userSearchInput);
    },
    [userSearchInput, handleUserSearch]
  );

  return (
    <form onSubmit={onSubmit} className="text-center my-8">
      <div className="text-[#919191] font-semibold text-xs uppercase -mb-2">Showing results for:</div>
      <div className="w-full px-6 md:px-0 md:w-[60%] mx-auto relative">
        <input
          type="text"
          value={userSearchInput}
          onChange={(e) => setUserSearchInput(e.target.value)}
          className="text-3xl md:text-[41px] text-[#111111] font-medium focus:outline-none focus:border-gray-400 font-khand-headers mt-8 border-b w-full"
        />
        <button className="absolute bottom-2 right-6 md:bottom-4 md:right-4">
          <RiSearchLine className="w-5 h-5 md:w-8 md:h-8" />
        </button>
      </div>
    </form>
  );
};

export default Search;
