import { ObjectType, Field, Float } from '@nestjs/graphql';
import { CaseModel } from './case.model';

@ObjectType()
export class SearchResult {
  @Field(() => CaseModel)
  case: CaseModel;

  @Field(() => String)
  relevantChunk: string;

  @Field(() => Float)
  similarity: number;
}
