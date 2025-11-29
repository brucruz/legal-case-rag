import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { SearchResult } from './dto/search-result.model';
import { CasesService } from './cases.service';

@Resolver()
export class CasesResolver {
  constructor(private readonly casesService: CasesService) {}

  @Query(() => [SearchResult])
  async searchCases(
    @Args('query') query: string,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<SearchResult[]> {
    return await this.casesService.search(query, limit);
  }
}
