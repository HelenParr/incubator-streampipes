/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.apache.streampipes.connect.container.worker.rest;

import org.apache.streampipes.connect.api.Connector;
import org.apache.streampipes.connect.container.worker.management.RuntimeResovable;
import org.apache.streampipes.container.api.ResolvesContainerProvidedOptions;
import org.apache.streampipes.container.api.RuntimeResolvableRequestHandler;
import org.apache.streampipes.container.api.SupportsRuntimeConfig;
import org.apache.streampipes.model.runtime.RuntimeOptionsRequest;
import org.apache.streampipes.model.runtime.RuntimeOptionsResponse;
import org.apache.streampipes.rest.shared.annotation.JacksonSerialized;
import org.apache.streampipes.rest.shared.impl.AbstractSharedRestInterface;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/api/v1/worker/resolvable")
public class RuntimeResolvableResource extends AbstractSharedRestInterface {

    @POST
    @Path("{id}/configurations")
    @JacksonSerialized
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response fetchConfigurations(@PathParam("id") String elementId,
                                        RuntimeOptionsRequest runtimeOptionsRequest) {

        Connector connector = RuntimeResovable.getAdapterOrProtocol(elementId);
        RuntimeOptionsResponse response;
        RuntimeResolvableRequestHandler handler = new RuntimeResolvableRequestHandler();

        if (connector instanceof ResolvesContainerProvidedOptions) {
            response = handler.handleRuntimeResponse((ResolvesContainerProvidedOptions) connector, runtimeOptionsRequest);
        } else if (connector instanceof SupportsRuntimeConfig) {
            response = handler.handleRuntimeResponse((SupportsRuntimeConfig) connector, runtimeOptionsRequest);
        } else {
            throw new WebApplicationException(javax.ws.rs.core.Response.Status.BAD_REQUEST);
        }

        return ok(response);
    }

}
