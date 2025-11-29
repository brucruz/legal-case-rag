import { Module } from '@nestjs/common';
import { CasesService } from './cases.service';
import { DatabaseModule } from 'src/database/database.module';
import { EmbeddingsModule } from 'src/embeddings/embeddings.module';
import { CasesResolver } from './cases.resolver';

@Module({
  imports: [DatabaseModule, EmbeddingsModule],
  providers: [CasesService, CasesResolver],
  exports: [CasesService],
})
export class CasesModule {}
