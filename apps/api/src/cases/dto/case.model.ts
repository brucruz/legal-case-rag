import { ObjectType, Field } from '@nestjs/graphql';
import { Case } from '@prisma/client';

@ObjectType()
export class CaseModel implements Case {
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

  @Field(() => Date)
  date: Date;

  @Field(() => String)
  jurisdiction: string;

  @Field(() => String)
  summary: string;

  @Field(() => String)
  fullText: string;

  @Field(() => String, { nullable: true })
  sourceUrl: string | null;

  @Field(() => Date)
  createdAt: Date;
}
