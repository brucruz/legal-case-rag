import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class CaseModel {
  @Field(() => String)
  id: string;

  @Field(() => String)
  caseNumber: string;

  @Field(() => String, { nullable: true })
  celexId: string | null;

  @Field(() => String)
  title: string;

  @Field(() => String)
  court: string;

  @Field(() => String)
  date: Date | string;

  @Field(() => String)
  jurisdiction: string;

  @Field(() => String)
  summary: string;

  @Field(() => String)
  fullText: string;

  @Field(() => String, { nullable: true })
  sourceUrl: string | null;

  @Field(() => String)
  createdAt: Date | string;
}
